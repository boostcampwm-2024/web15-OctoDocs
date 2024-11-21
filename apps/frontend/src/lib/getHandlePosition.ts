import { Position, type Node } from "@xyflow/react";
export function getHandlePosition(node: Node, handleId: Position) {
  const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
  const nodeRect = nodeElement!.getBoundingClientRect();
  const nodeWidth = nodeRect.width;
  const nodeHeight = nodeRect.height;

  const positions = {
    [Position.Left]: {
      x: node.position.x,
      y: node.position.y + nodeHeight / 2,
    },
    [Position.Right]: {
      x: node.position.x + nodeWidth,
      y: node.position.y + nodeHeight / 2,
    },
    [Position.Top]: {
      x: node.position.x + nodeWidth / 2,
      y: node.position.y,
    },
    [Position.Bottom]: {
      x: node.position.x + nodeWidth / 2,
      y: node.position.y + nodeHeight,
    },
  };

  return positions[handleId];
}
