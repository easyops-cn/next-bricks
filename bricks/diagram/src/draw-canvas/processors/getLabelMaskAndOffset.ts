import type {
  PositionTuple,
  SimpleRect,
  SizeTuple,
} from "../../diagram/interfaces";
import type { PositionAndAngle } from "../interfaces";

export function getLabelMaskAndOffset(
  labelPosition: PositionAndAngle | null,
  labelSize: SizeTuple | null
): [labelMask: SimpleRect | null, labelOffset: PositionTuple | null] {
  if (!labelPosition || !labelSize) {
    return [null, null];
  }
  const padding = 3;
  const [x, y, direction, angle, gap] = labelPosition;
  const [width, height] = labelSize;

  const left = x - width / 2 - padding;
  const top = y - height / 2 - padding;
  let offsetX = 0;
  let offsetY = 0;
  const halfWidth = width / 2 + padding;
  const halfHeight = height / 2 + padding;
  switch (direction) {
    case "top":
      offsetX = gap * Math.cos(angle) - halfHeight / Math.tan(angle);
      offsetY = gap * Math.sin(angle) - halfHeight;
      break;
    case "bottom":
      offsetX = gap * Math.cos(angle) + halfHeight / Math.tan(angle);
      offsetY = gap * Math.sin(angle) + halfHeight;
      break;
    case "left":
      offsetX = gap * Math.cos(angle) - halfWidth;
      offsetY = gap * Math.sin(angle) - halfWidth * Math.tan(angle);
      break;
    case "right":
      offsetX = gap * Math.cos(angle) + halfWidth;
      offsetY = gap * Math.sin(angle) + halfWidth * Math.tan(angle);
      break;
  }

  return [
    {
      left: left + offsetX,
      top: top + offsetY,
      width: width + padding * 2,
      height: height + padding * 2,
    },
    [offsetX, offsetY],
  ];
}
