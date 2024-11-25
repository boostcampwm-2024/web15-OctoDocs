import { Placement, Offset } from "@/shared/model/usePopover";

export interface Position {
  top: number;
  left: number;
}

interface PositionConfig {
  triggerRect: DOMRect;
  contentRect: DOMRect;
  offset: Offset;
}

const getTopPosition = ({
  triggerRect,
  contentRect,
  offset,
}: PositionConfig): Position => ({
  top: triggerRect.top - contentRect.height - offset.y,
  left:
    triggerRect.left + (triggerRect.width - contentRect.width) / 2 + offset.x,
});

const getRightPosition = ({
  triggerRect,
  contentRect,
  offset,
}: PositionConfig): Position => ({
  top:
    triggerRect.top + (triggerRect.height - contentRect.height) / 2 + offset.y,
  left: triggerRect.right + offset.x,
});

const getBottomPosition = ({
  triggerRect,
  contentRect,
  offset,
}: PositionConfig): Position => ({
  top: triggerRect.bottom + offset.y,
  left:
    triggerRect.left + (triggerRect.width - contentRect.width) / 2 + offset.x,
});

const getLeftPosition = ({
  triggerRect,
  contentRect,
  offset,
}: PositionConfig): Position => ({
  top:
    triggerRect.top + (triggerRect.height - contentRect.height) / 2 + offset.y,
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
): Position {
  const config = { triggerRect, contentRect, offset };
  return positionMap[placement](config);
}
