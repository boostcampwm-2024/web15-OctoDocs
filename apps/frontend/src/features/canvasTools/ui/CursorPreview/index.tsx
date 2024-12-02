import { useState, useRef } from "react";

import { BiggerCursor } from "@/shared/ui";

interface CursorPreviewProps {
  color: string;
  clientId: string;
  defaultCoors: { x: number; y: number };
}

export function CursorPreview({
  color,
  clientId,
  defaultCoors,
}: CursorPreviewProps) {
  const [coors, setCoors] = useState(defaultCoors);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      setCoors({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setCoors(defaultCoors);
  };

  return (
    <div
      ref={previewRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-48 w-60 overflow-hidden rounded-md border-[1px] border-[#d0d9e0] bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:7px_7px]"
    >
      <BiggerCursor coors={coors} clientId={clientId} color={color} />
    </div>
  );
}
