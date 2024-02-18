import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { PositionTuple } from "../diagram/interfaces";

const { defineElement, method } = createDecorators();

/**
 * 构件 `eo-draw-canvas`
 */
export
@defineElement("eo-draw-canvas", {
  styleTexts: [styleText],
})
class EoDrawCanvas extends ReactNextElement {
  @method()
  drop({
    position,
    data,
  }: {
    position: PositionTuple;
    data: unknown;
  }): { position: PositionTuple; data: unknown } | null {
    const droppedInside = document
      .elementsFromPoint?.(position[0], position[1])
      ?.includes(this);
    if (droppedInside) {
      const boundingClientRect = this.getBoundingClientRect();
      return {
        position: [
          position[0] - boundingClientRect.left,
          position[1] - boundingClientRect.top,
        ],
        data,
      };
    }
    return null;
  }

  render() {
    return <EoDrawCanvasComponent />;
  }
}

// export interface EoDrawCanvasProps {
//   // Define props here.
// }

export function EoDrawCanvasComponent(/* props: EoDrawCanvasProps */) {
  return <slot />;
}
