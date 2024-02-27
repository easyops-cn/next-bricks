// istanbul ignore file: experimental only
import React, { useCallback } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type { PositionTuple } from "../diagram/interfaces";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

type ExperimentalUsage = "library" | "dragging" | "default";

export interface ExperimentalNodeProps {
  usage?: ExperimentalUsage;
}

/**
 * 构件 `diagram.experimental-node`
 */
export
@defineElement("diagram.experimental-node", {
  styleTexts: [styleText],
})
class ExperimentalNode
  extends ReactNextElement
  implements ExperimentalNodeProps
{
  @property()
  accessor usage: ExperimentalUsage | undefined;

  @event({ type: "drag.start" })
  accessor #dragStartEvent!: EventEmitter<PositionTuple>;

  #handleDragStart = (position: PositionTuple) => {
    this.#dragStartEvent.emit(position);
  };

  @event({ type: "drag.move" })
  accessor #dragMoveEvent!: EventEmitter<PositionTuple>;

  #handleDragMove = (position: PositionTuple) => {
    this.#dragMoveEvent.emit(position);
  };

  @event({ type: "drag.end" })
  accessor #dragEndEvent!: EventEmitter<PositionTuple>;

  #handleDragEnd = (position: PositionTuple) => {
    this.#dragEndEvent.emit(position);
  };

  render() {
    return (
      <ExperimentalNodeComponent
        usage={this.usage}
        onDragStart={this.#handleDragStart}
        onDragMove={this.#handleDragMove}
        onDragEnd={this.#handleDragEnd}
      />
    );
  }
}

export interface ExperimentalNodeComponentProps extends ExperimentalNodeProps {
  onDragStart?(position: PositionTuple): void;
  onDragMove?(position: PositionTuple): void;
  onDragEnd?(position: PositionTuple): void;
}

export function ExperimentalNodeComponent({
  usage,
  onDragStart,
  onDragMove,
  onDragEnd,
}: ExperimentalNodeComponentProps) {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (usage !== "library") {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const from: PositionTuple = [event.clientX, event.clientY];
      let moved = false;
      const onMouseMove = (e: MouseEvent) => {
        if (!moved) {
          moved = (e.clientX - from[0]) ** 2 + (e.clientY - from[1]) ** 2 >= 9;
          if (moved) {
            onDragStart?.([e.clientX, e.clientY]);
          }
        }
        if (moved) {
          onDragMove?.([e.clientX, e.clientY]);
        }
      };
      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        if (moved) {
          onDragEnd?.([e.clientX, e.clientY]);
        }
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onDragEnd, onDragMove, onDragStart, usage]
  );

  return (
    <div onMouseDown={handleMouseDown}>
      <slot />
    </div>
  );
}
