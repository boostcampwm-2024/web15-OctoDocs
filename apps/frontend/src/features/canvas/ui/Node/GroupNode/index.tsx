import { memo } from "react";
import { NodeResizeControl } from "@xyflow/react";
import { Maximize2 } from "lucide-react";

const controlStyle = {
  background: "transparent",
  border: "none",
};

export function GroupNode() {
  return (
    <>
      <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
        <Maximize2
          size={16}
          className="absolute bottom-1 right-1 rotate-90 transform"
        />
      </NodeResizeControl>
    </>
  );
}

export default memo(GroupNode);
