import { ReactFlowProvider } from "@xyflow/react";

import { Canvas } from "@/features/canvas";

export function CanvasView() {
  return (
    <ReactFlowProvider>
      <Canvas className="z-0 h-full w-full" />
    </ReactFlowProvider>
  );
}
