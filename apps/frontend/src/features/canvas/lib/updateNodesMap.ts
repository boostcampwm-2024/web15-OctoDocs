import * as Y from "yjs";
import { YEvent } from "yjs";

import { Node } from "@/entities/node";

export const updateNodesMapByYTextEvent = (
  event: YEvent<any>[],
  nodesMap: Y.Map<any>,
  key: "title" | "emoji",
) => {
  if (!event[0].path.length) return;

  const pageId = event[0].path[0].toString().split("_")[1];
  const value = event[0].target.toString();

  const existingNode = nodesMap.get(pageId) as Node;
  if (!existingNode) return;

  const newNode: Node = {
    ...existingNode,
    data: { ...existingNode.data, id: pageId, [key]: value },
    selected: false,
    isHolding: false,
  };

  nodesMap.set(pageId, newNode);
};
