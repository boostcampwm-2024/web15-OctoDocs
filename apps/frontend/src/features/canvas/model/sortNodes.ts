import { Edge, Node } from "@xyflow/react";
import ELK from "elkjs";

const elk = new ELK();

export const getSortedNodes = async (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "force",
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: 160, // 실제 노드 너비로 변경하기 (node.width)
      height: 40, // 실제 노드 높이로 변경하기 (node.height)
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await elk.layout(graph);

  const updatedNodes = nodes.map((node) => {
    const layoutNode = layout!.children!.find((n) => n.id === node.id);

    return {
      ...node,
      position: {
        x: layoutNode!.x as number,
        y: layoutNode!.y as number,
      },
    };
  });

  return updatedNodes;
};
