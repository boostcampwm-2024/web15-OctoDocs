import { Position, Node, XYPosition } from "@xyflow/react";

const getAbsolutePosition = (node: Node, nodes: Node[]): XYPosition => {
  if (!node.parentId) {
    return node.position;
  }

  const parentNode = nodes.find((n) => n.id === node.parentId);
  if (!parentNode) {
    return node.position;
  }

  const parentPosition: XYPosition = getAbsolutePosition(parentNode, nodes);
  return {
    x: parentPosition.x + node.position.x,
    y: parentPosition.y + node.position.y,
  };
};

export const getHandlePosition = (
  node: Node,
  handleId: Position,
  nodes: Node[],
) => {
  const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
  const nodeRect = nodeElement!.getBoundingClientRect();
  const nodeWidth = nodeRect.width;
  const nodeHeight = nodeRect.height;

  const absolutePosition = getAbsolutePosition(node, nodes);

  const positions = {
    [Position.Left]: {
      x: absolutePosition.x,
      y: absolutePosition.y + nodeHeight / 2,
    },
    [Position.Right]: {
      x: absolutePosition.x + nodeWidth,
      y: absolutePosition.y + nodeHeight / 2,
    },
    [Position.Top]: {
      x: absolutePosition.x + nodeWidth / 2,
      y: absolutePosition.y,
    },
    [Position.Bottom]: {
      x: absolutePosition.x + nodeWidth / 2,
      y: absolutePosition.y + nodeHeight,
    },
  };

  return positions[handleId];
};

export const calculateBestHandles = (
  sourceNode: Node,
  targetNode: Node,
  nodes: Node[],
) => {
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
    const sourcePosition = getHandlePosition(sourceNode, sourceHandle, nodes);
    handlePositions.forEach((targetHandle) => {
      const targetPosition = getHandlePosition(targetNode, targetHandle, nodes);
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
