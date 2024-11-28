import { type Node } from "@xyflow/react";

export const getRelativePosition = (node: Node, parentNode: Node) => ({
  x: node.position.x - parentNode.position.x,
  y: node.position.y - parentNode.position.y,
});

export const getAbsolutePosition = (node: Node, parentNode: Node) => ({
  x: parentNode.position.x + node.position.x,
  y: parentNode.position.y + node.position.y,
});
