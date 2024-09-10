import type { Direction, NodePosition, NodeRect } from "../interfaces";

const MINIMAL_OFFSET = 20;

export function getPolyLinePoints(
  source: NodeRect,
  target: NodeRect,
  sourceDirection: Direction,
  targetDirection: Direction,
  sourcePosition: number,
  targetPosition: number
): NodePosition[] {
  const p0 = getCoordinates(source, sourceDirection, sourcePosition);
  const p1 = getCoordinates(target, targetDirection, targetPosition);

  let controls: NodePosition[] = [];
  let reverseControls = false;

  const sourceIsVertical =
    sourceDirection === "top" || sourceDirection === "bottom";
  const targetIsVertical =
    targetDirection === "top" || targetDirection === "bottom";

  if (sourceIsVertical !== targetIsVertical) {
    // One is vertical and the other is horizontal
    let horizontal: NodeRect;
    let vertical: NodeRect;
    let horizontalSign: number;
    let verticalSign: number;
    let horizontalPosition: NodePosition;
    let verticalPosition: NodePosition;
    if (sourceIsVertical) {
      horizontal = target;
      vertical = source;
      horizontalSign = targetDirection === "right" ? 1 : -1;
      verticalSign = sourceDirection === "bottom" ? 1 : -1;
      horizontalPosition = p1;
      verticalPosition = p0;
    } else {
      horizontal = source;
      vertical = target;
      horizontalSign = sourceDirection === "right" ? 1 : -1;
      verticalSign = targetDirection === "bottom" ? 1 : -1;
      horizontalPosition = p0;
      verticalPosition = p1;
      reverseControls = true;
    }

    const defaultControlX =
      horizontalPosition.x + MINIMAL_OFFSET * horizontalSign;
    const defaultControlY = verticalPosition.y + MINIMAL_OFFSET * verticalSign;

    if ((horizontal.x - vertical.x) * horizontalSign >= 0) {
      if ((vertical.y - horizontal.y) * verticalSign >= 0) {
        //    ┌──────────────┐
        // ┌──┴──┐   ┌─────┐ │
        // │  S  │   │  T  ├─┘
        // └─────┘   └─────┘
        controls = [
          { x: verticalPosition.x, y: defaultControlY },
          { x: defaultControlX, y: defaultControlY },
          { x: defaultControlX, y: horizontalPosition.y },
        ];
      } else {
        const controlY0 =
          vertical.y + (vertical.height / 2 + MINIMAL_OFFSET) * verticalSign;
        const controlY1 =
          horizontal.y -
          (horizontal.height / 2 + MINIMAL_OFFSET) * verticalSign;
        if ((controlY1 - controlY0) * verticalSign >= 0) {
          //     ┌─────┐
          //     │  T  ├─┐
          //     └─────┘ │
          //    ┌────────┘
          // ┌──┴──┐
          // │  S  │
          // └─────┘
          const middleY = (controlY0 + controlY1) / 2;
          controls = [
            { x: verticalPosition.x, y: middleY },
            { x: defaultControlX, y: middleY },
            { x: defaultControlX, y: horizontalPosition.y },
          ];
        } else {
          //           ┌─────┐
          //    ┌────┐ │  T  ├─┐
          // ┌──┴──┐ │ └─────┘ │
          // │  S  │ └─────────┘
          // └─────┘
          const middleX =
            (vertical.x +
              (vertical.width / 2) * horizontalSign +
              horizontal.x -
              (horizontal.width / 2) * horizontalSign) /
            2;
          controls = [
            { x: verticalPosition.x, y: controlY0 },
            { x: middleX, y: controlY0 },
            { x: middleX, y: controlY1 },
            { x: defaultControlX, y: controlY1 },
            { x: defaultControlX, y: horizontalPosition.y },
          ];
        }
      }
    } else if ((horizontalPosition.y - defaultControlY) * verticalSign >= 0) {
      if ((verticalPosition.x - defaultControlX) * horizontalSign >= 0) {
        //       ┌─────┐
        //    ┌──┤  T  │
        //    │  └─────┘
        // ┌──┴──┐
        // │  S  │
        // └─────┘
        controls = [{ x: verticalPosition.x, y: horizontalPosition.y }];
      } else {
        // ┌─────┐
        // │  T  ├─┐
        // └─────┘ │
        //       ┌─┘
        //    ┌──┴──┐
        //    │  S  │
        //    └─────┘
        const controlY0 =
          vertical.y + (vertical.height / 2 + MINIMAL_OFFSET) * verticalSign;
        const controlY1 =
          horizontal.y -
          (horizontal.height / 2 + MINIMAL_OFFSET) * verticalSign;
        const middleY = (controlY0 + controlY1) / 2;
        controls = [
          { x: verticalPosition.x, y: middleY },
          { x: defaultControlX, y: middleY },
          { x: defaultControlX, y: horizontalPosition.y },
        ];
      }
    } else {
      const sourceExtendX =
        vertical.x - (vertical.width / 2 + MINIMAL_OFFSET) * horizontalSign;
      if ((sourceExtendX - defaultControlX) * horizontalSign >= 0) {
        //         ┌────┐
        //         │ ┌──┴──┐
        //         │ │  S  │
        // ┌─────┐ │ └─────┘
        // │  T  ├─┘
        // └─────┘
        const middleX = (sourceExtendX + defaultControlX) / 2;
        controls = [
          { x: verticalPosition.x, y: defaultControlY },
          { x: middleX, y: defaultControlY },
          { x: middleX, y: horizontalPosition.y },
        ];
      } else {
        //     ┌────┐
        //     │ ┌──┴──┐
        //     │ │  S  │
        //     │ └─────┘
        //     └───┐
        // ┌─────┐ │
        // │  T  ├─┘
        // └─────┘
        const middleY =
          (vertical.y -
            (vertical.height / 2) * verticalSign +
            horizontal.y +
            (horizontal.height / 2) * verticalSign) /
          2;
        controls = [
          { x: verticalPosition.x, y: defaultControlY },
          { x: sourceExtendX, y: defaultControlY },
          { x: sourceExtendX, y: middleY },
          { x: defaultControlX, y: middleY },
          { x: defaultControlX, y: horizontalPosition.y },
        ];
      }
    }
  } else if (sourceDirection === targetDirection) {
    // Same direction
    const sign =
      sourceDirection === "bottom" || sourceDirection === "right" ? 1 : -1;
    let start: NodeRect;
    let end: NodeRect;
    let startPosition: NodePosition;
    let endPosition: NodePosition;
    const axis = sourceIsVertical ? "y" : "x";
    const oppositeAxis = sourceIsVertical ? "x" : "y";
    if (target[axis] < source[axis]) {
      start = target;
      end = source;
      startPosition = p1;
      endPosition = p0;
      reverseControls = sign === 1;
    } else {
      start = source;
      end = target;
      startPosition = p0;
      endPosition = p1;
      reverseControls = sign !== 1;
    }
    const perpendicular =
      target[oppositeAxis] < source[oppositeAxis] ? source : target;
    let around: NodeRect;
    let nonAround: NodeRect;
    let aroundPosition: NodePosition;
    let nonAroundPosition: NodePosition;
    if (sign === 1) {
      around = end;
      nonAround = start;
      aroundPosition = endPosition;
      nonAroundPosition = startPosition;
    } else {
      around = start;
      nonAround = end;
      aroundPosition = startPosition;
      nonAroundPosition = endPosition;
    }
    const aroundSign = around === perpendicular ? 1 : -1;
    if (sourceIsVertical) {
      const defaultControlX =
        around.x - (around.width / 2 + MINIMAL_OFFSET) * aroundSign;
      const defaultControlY = aroundPosition.y + MINIMAL_OFFSET * sign;
      if ((defaultControlX - nonAroundPosition.x) * aroundSign >= 0) {
        //    ┌─────────┐
        //    │      ┌──┴──┐
        //    │      │  T  │
        // ┌──┴──┐   └─────┘
        // │  S  │
        // └─────┘
        controls = [
          { x: nonAroundPosition.x, y: defaultControlY },
          { x: aroundPosition.x, y: defaultControlY },
        ];
      } else {
        //  ┌────┐
        //  │ ┌──┴──┐
        //  │ │  T  │
        //  │ └─────┘
        //  └─┐
        // ┌──┴──┐
        // │  S  │
        // └─────┘
        const middleY =
          (nonAround.y +
            (nonAround.height / 2) * sign +
            around.y -
            (around.height / 2) * sign) /
          2;
        controls = [
          { x: nonAroundPosition.x, y: middleY },
          { x: defaultControlX, y: middleY },
          { x: defaultControlX, y: defaultControlY },
          { x: aroundPosition.x, y: defaultControlY },
        ];
      }
    } else {
      const defaultControlX = aroundPosition.x + MINIMAL_OFFSET * sign;
      const defaultControlY =
        around.y - (around.height / 2 + MINIMAL_OFFSET) * aroundSign;
      if ((defaultControlY - nonAroundPosition.y) * aroundSign >= 0) {
        //           ┌─────┐
        // ┌─────────┤  T  │
        // │ ┌─────┐ └─────┘
        // └─┤  S  │
        //   └─────┘
        controls = [
          { x: defaultControlX, y: nonAroundPosition.y },
          { x: defaultControlX, y: aroundPosition.y },
        ];
      } else {
        // ┌─────────┐
        // │ ┌─────┐ │ ┌─────┐
        // └─┤  S  │ └─┤  T  │
        //   └─────┘   └─────┘
        const middleX =
          (nonAround.x +
            (nonAround.width / 2) * sign +
            around.x -
            (around.width / 2) * sign) /
          2;
        controls = [
          { x: middleX, y: nonAroundPosition.y },
          { x: middleX, y: defaultControlY },
          { x: defaultControlX, y: defaultControlY },
          { x: defaultControlX, y: aroundPosition.y },
        ];
      }
    }
  } else {
    // Opposite direction
    const targetSign =
      targetDirection === "bottom" || targetDirection === "right" ? 1 : -1;
    let axis: "x" | "y";
    let oppositeAxis: "x" | "y";
    let size: "width" | "height";
    let oppositeSize: "width" | "height";
    if (sourceIsVertical) {
      axis = "y";
      oppositeAxis = "x";
      size = "height";
      oppositeSize = "width";
    } else {
      axis = "x";
      oppositeAxis = "y";
      size = "width";
      oppositeSize = "height";
    }
    const targetEdge = target[axis] + (target[size] / 2) * targetSign;
    const sourceEdge = source[axis] - (source[size] / 2) * targetSign;
    const targetControl = targetEdge + MINIMAL_OFFSET * targetSign;
    const sourceControl = sourceEdge - MINIMAL_OFFSET * targetSign;
    const oppositeIsStraight = p0[oppositeAxis] === p1[oppositeAxis];
    if ((sourceControl - targetControl) * targetSign >= 0) {
      const middle = (sourceControl + targetControl) / 2;
      if (oppositeIsStraight) {
        // Straight line
        // ┌─────┐
        // │  T  │
        // └──┬──┘
        //    │
        // ┌──┴──┐
        // │  S  │
        // └─────┘
        controls = [];
      } else {
        //     ┌─────┐
        //     │  T  │
        //     └──┬──┘
        //    ┌───┘
        // ┌──┴──┐
        // │  S  │
        // └─────┘
        controls = [
          { [oppositeAxis]: p0[oppositeAxis], [axis]: middle },
          { [oppositeAxis]: p1[oppositeAxis], [axis]: middle },
        ] as unknown[] as NodePosition[];
      }
    } else if (
      oppositeIsStraight &&
      (sourceEdge - targetEdge) * targetSign >= 0
    ) {
      // Straight line (very close)
      // ┌─────┐
      // │  T  │
      // └──┬──┘
      // ┌──┴──┐
      // │  S  │
      // └─────┘
      controls = [];
    } else {
      const targetOppositeSign =
        target[oppositeAxis] < source[oppositeAxis] ? -1 : 1;
      const sourceOppositeControl =
        source[oppositeAxis] +
        (source[oppositeSize] / 2 + MINIMAL_OFFSET) * targetOppositeSign;
      const targetOppositeControl =
        target[oppositeAxis] -
        (target[oppositeSize] / 2 + MINIMAL_OFFSET) * targetOppositeSign;
      if (
        (targetOppositeControl - sourceOppositeControl) * targetOppositeSign >=
          0 ||
        Math.abs((sourceControl - targetControl) * targetSign) < MINIMAL_OFFSET
      ) {
        //           ┌─────┐
        //    ┌────┐ │  T  │
        // ┌──┴──┐ │ └──┬──┘
        // │  S  │ └────┘
        // └─────┘
        const oppositeMiddle =
          (sourceOppositeControl + targetOppositeControl) / 2;
        controls = [
          { [oppositeAxis]: p0[oppositeAxis], [axis]: sourceControl },
          { [oppositeAxis]: oppositeMiddle, [axis]: sourceControl },
          { [oppositeAxis]: oppositeMiddle, [axis]: targetControl },
          { [oppositeAxis]: p1[oppositeAxis], [axis]: targetControl },
        ] as unknown[] as NodePosition[];
      } else {
        //      ┌────┐
        //   ┌──┴──┐ │
        //   │  S  │ │
        //   └─────┘ │
        // ┌─────────┘
        // │ ┌─────┐
        // │ │  T  │
        // │ └──┬──┘
        // └────┘
        const middle =
          (source[axis] +
            (source[size] / 2) * targetSign +
            target[axis] -
            (target[size] / 2) * targetSign) /
          2;
        controls = [
          { [oppositeAxis]: p0[oppositeAxis], [axis]: sourceControl },
          { [oppositeAxis]: sourceOppositeControl, [axis]: sourceControl },
          { [oppositeAxis]: sourceOppositeControl, [axis]: middle },
          { [oppositeAxis]: targetOppositeControl, [axis]: middle },
          { [oppositeAxis]: targetOppositeControl, [axis]: targetControl },
          { [oppositeAxis]: p1[oppositeAxis], [axis]: targetControl },
        ] as unknown[] as NodePosition[];
      }
    }
  }

  if (reverseControls) {
    controls.reverse();
  }

  return [p0, ...controls, p1] as NodePosition[];
}

function getCoordinates(
  node: NodeRect,
  direction: Direction,
  position: number
): NodePosition {
  const { x, y, width, height } = node;
  switch (direction) {
    case "top":
      return {
        x: x - width / 2 + width * position,
        y: y - height / 2,
      };
    case "bottom":
      return {
        x: x - width / 2 + width * position,
        y: y + height / 2,
      };
    case "left":
      return {
        x: x - width / 2,
        y: y - height / 2 + height * position,
      };
    case "right":
      return {
        x: x + width / 2,
        y: y - height / 2 + height * position,
      };
  }
}
