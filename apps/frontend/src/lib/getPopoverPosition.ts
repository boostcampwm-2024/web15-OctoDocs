import { Placement, Offset, Alignment } from "@/hooks/usePopover";

export interface Position {
  top: number;
  left: number;
}

interface PositionConfig {
  triggerRect: DOMRect;
  contentRect: DOMRect;
  offset: Offset;
  align: Alignment;
}

const alignmentMap: Record<
  Alignment,
  (triggerSize: number, contentSize: number) => number
> = {
  start: () => 0,
  center: (triggerSize, contentSize) => (triggerSize - contentSize) / 2,
  end: (triggerSize, contentSize) => triggerSize - contentSize,
};

const getAlignment = (
  triggerSize: number,
  contentSize: number,
  align: Alignment,
): number => {
  return alignmentMap[align](triggerSize, contentSize);
};

const getTopPosition = ({
  triggerRect,
  contentRect,
  offset,
  align,
}: PositionConfig): Position => ({
  top: triggerRect.top - contentRect.height - offset.y,
  left:
    triggerRect.left +
    getAlignment(triggerRect.width, contentRect.width, align) +
    offset.x,
});

const getRightPosition = ({
  triggerRect,
  contentRect,
  offset,
  align,
}: PositionConfig): Position => ({
  top:
    triggerRect.top +
    getAlignment(triggerRect.height, contentRect.height, align) +
    offset.y,
  left: triggerRect.right + offset.x,
});

const getBottomPosition = ({
  triggerRect,
  contentRect,
  offset,
  align,
}: PositionConfig): Position => ({
  top: triggerRect.bottom + offset.y,
  left:
    triggerRect.left +
    getAlignment(triggerRect.width, contentRect.width, align) +
    offset.x,
});

const getLeftPosition = ({
  triggerRect,
  contentRect,
  offset,
  align,
}: PositionConfig): Position => ({
  top:
    triggerRect.top +
    getAlignment(triggerRect.height, contentRect.height, align) +
    offset.y,
  left: triggerRect.left - contentRect.width - offset.x,
});

const positionMap: Record<Placement, (config: PositionConfig) => Position> = {
  top: getTopPosition,
  right: getRightPosition,
  bottom: getBottomPosition,
  left: getLeftPosition,
};

export function getPosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  placement: Placement,
  offset: Offset,
  align: Alignment,
): Position {
  const config = { triggerRect, contentRect, offset, align };
  return positionMap[placement](config);
}
