import React, { useCallback } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type { PositionTuple } from "../diagram/interfaces";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

export type Shape = "circle" | "rect";

export interface EoShapeProps {
  shape?: Shape;
}

/**
 * 构件 `eo-shape`
 */
export
@defineElement("eo-shape", {
  styleTexts: [styleText],
})
class EoShape extends ReactNextElement implements EoShapeProps {
  @property()
  accessor shape: Shape | undefined;

  @property({ type: Boolean, render: false })
  accessor dragging: boolean | undefined;

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
      <EoShapeComponent
        shape={this.shape}
        onDragStart={this.#handleDragStart}
        onDragMove={this.#handleDragMove}
        onDragEnd={this.#handleDragEnd}
      />
    );
  }
}

export interface EoShapeComponentProps extends EoShapeProps {
  onDragStart?(position: PositionTuple): void;
  onDragMove?(position: PositionTuple): void;
  onDragEnd?(position: PositionTuple): void;
}

export function EoShapeComponent({
  shape,
  onDragStart,
  onDragMove,
  onDragEnd,
}: EoShapeComponentProps) {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
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
    [onDragEnd, onDragMove, onDragStart]
  );

  return <div onMouseDown={handleMouseDown}>{shape}</div>;
}
