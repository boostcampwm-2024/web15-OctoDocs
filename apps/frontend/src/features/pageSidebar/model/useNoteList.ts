import { useEffect, useState } from "react";

import { useDeletePage } from "../api/usePages";
import { usePageStore } from "./pageStore";
import { useYDocStore } from "@/shared/model";
// TODO: Node entity 만들어야할듯?
import { YNode } from "@/features/canvas/model/useCanvas";
// TODO: Node entity 만들어야할듯?
import { NoteNodeData } from "@/features/canvas/ui/Node/NoteNode";

export const useNoteList = () => {
  const { setCurrentPage } = usePageStore();

  const [pages, setPages] = useState<NoteNodeData[]>();
  const { ydoc } = useYDocStore();
  const nodesMap = ydoc.getMap("nodes");

  // TODO: 최적화 필요
  useEffect(() => {
    nodesMap.observe(() => {
      const yNodes = Array.from(nodesMap.values()) as YNode[];
      const data = yNodes.map((yNode) => yNode.data) as NoteNodeData[];
      setPages(data);
    });
  }, []);

  const [noteIdToDelete, setNoteIdToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useDeletePage();

  const handleNoteClick = (id: number) => {
    setCurrentPage(id);
  };

  const openModal = (noteId: number) => {
    setNoteIdToDelete(noteId);
    setIsModalOpen(true);
  };

  const onConfirm = () => {
    if (noteIdToDelete === null) {
      return;
    }

    const nodesMap = ydoc.getMap("nodes");
    nodesMap.delete(noteIdToDelete.toString());
    deleteMutation.mutate({ id: noteIdToDelete });

    setIsModalOpen(false);
    setCurrentPage(null);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    pages,
    isModalOpen,
    handleNoteClick,
    openModal,
    onConfirm,
    onCloseModal,
  };
};
