import { useEffect, useState } from "react";

import { NodeForm } from "../NodeForm";
import { Node } from "@/entities/node";
import { useYDocStore } from "@/shared/model";
import { Popover } from "@/shared/ui";

interface NodePanelProps {
  currentPage: string;
}

export function NodePanel({ currentPage }: NodePanelProps) {
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const { ydoc } = useYDocStore();

  const changeNodeColor = (color: string) => {
    const nodesMap = ydoc.getMap("nodes");
    const id = currentPage.toString();

    const existingNode = nodesMap.get(id) as Node;
    nodesMap.set(id, {
      ...existingNode,
      data: { ...existingNode.data, color },
    });
    setCurrentColor(color);
  };

  useEffect(() => {
    const nodesMap = ydoc.getMap("nodes");
    const currentNode = nodesMap.get(currentPage.toString()) as Node;
    setCurrentColor(currentNode.data.color as string);
  }, [currentPage]);

  return (
    <Popover placement="bottom" align="start" offset={{ x: -11, y: 16 }}>
      <Popover.Trigger>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md border-[1px] border-neutral-300"
          style={{ backgroundColor: currentColor }}
        />
      </Popover.Trigger>
      <Popover.Content className="rounded-lg border bg-white p-3 shadow-md">
        <NodeForm changeNodeColor={changeNodeColor} />
      </Popover.Content>
    </Popover>
  );
}
