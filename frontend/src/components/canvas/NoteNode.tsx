import { Handle, NodeProps, Position, type Node } from "@xyflow/react";
import usePageStore from "@/store/usePageStore";

export type NoteNodeData = { title: string; id: number };
export type NoteNodeType = Node<NoteNodeData, "note">;

export function NoteNode({ data }: NodeProps<NoteNodeType>) {
  const { setCurrentPage } = usePageStore();

  const handleNodeClick = () => {
    const id = data.id;
    if (id === undefined || id === null) {
      return;
    }

    setCurrentPage(id);
  };

  return (
    <div
      className="rounded-md border-[1px] border-black bg-neutral-100 p-2"
      onClick={handleNodeClick}
    >
      <Handle
        type="source"
        id="left"
        position={Position.Left}
        isConnectable={true}
      />
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        isConnectable={true}
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        isConnectable={true}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        isConnectable={true}
      />
      {data.title}
    </div>
  );
}
