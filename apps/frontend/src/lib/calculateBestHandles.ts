import { Position, Node } from "@xyflow/react";
import { getHandlePosition } from "./getHandlePosition";

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
