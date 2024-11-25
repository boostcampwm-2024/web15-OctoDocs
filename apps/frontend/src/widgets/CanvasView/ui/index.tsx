import { Canvas } from "@/features/canvas";
import { ReactFlowProvider } from "@xyflow/react";

export function CanvasView() {
  return (
    <ReactFlowProvider>
      <Canvas className="z-0 h-full w-full" />
    </ReactFlowProvider>
  );
}
