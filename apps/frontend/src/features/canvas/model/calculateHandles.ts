import { Position, Node } from "@xyflow/react";

export const getHandlePosition = (node: Node, handleId: Position) => {
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
};

export const calculateBestHandles = (sourceNode: Node, targetNode: Node) => {
  const handlePositions = [
    Position.Left,
    Position.Right,
    Position.Top,
    Position.Bottom,
  ];
  let shortestDistance = Infinity;
  let bestHandles = {
    source: handlePositions[0],
    target: handlePositions[0],
  };

  handlePositions.forEach((sourceHandle) => {
    const sourcePosition = getHandlePosition(sourceNode, sourceHandle);
    handlePositions.forEach((targetHandle) => {
      const targetPosition = getHandlePosition(targetNode, targetHandle);
      const distance = Math.hypot(
        sourcePosition.x - targetPosition.x,
        sourcePosition.y - targetPosition.y,
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        bestHandles = { source: sourceHandle, target: targetHandle };
      }
    });
  });

  return bestHandles;
};
