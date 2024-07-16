import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BasicDecoratorProps } from "../interfaces";
import { handleMouseDown } from "../processors/handleMouseDown";
import classNames from "classnames";
import { get } from "lodash";
import { selectAllText } from "./DecoratorText";
import { isNoManualLayout } from "../processors/asserts";
import { uuidV4 } from "..";

export function DecoratorContainer({
  cell,
  transform,
  readOnly,
  layout,
  view,
  activeTarget,
  cells,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
  onDecoratorTextEditing,
  onDecoratorTextChange,
}: BasicDecoratorProps): JSX.Element {
  const label = get(cell.view, "text", "");
  const direction = get(cell.view, "direction", "top");
  const textRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = React.useRef<SVGGElement>(null);
  const [editingLabel, setEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string>(label);
  const [shouldEmitLabelChange, setShouldEmitLabelChange] = useState(false);
  const [recomputation, setRecomputation] = useState<string>();
  const [titleForeignRect, setTitleForeignRect] = useState({
    x: 0,
    y: 0,
    width: cell.view.width,
    height: cell.view.height,
  });
  const handleEnableEdit = useCallback(
    (e: React.MouseEvent) => {
      if (readOnly) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      setEditingLabel(true);
    },
    [readOnly]
  );
  const handleInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (readOnly) {
        return;
      }
      setCurrentLabel((event.target as HTMLDivElement).textContent!);
    },
    [readOnly]
  );

  const handleBlur = useCallback(() => {
    if (readOnly) {
      return;
    }
    setEditingLabel(false);
    setShouldEmitLabelChange(true);
    setRecomputation(uuidV4());
  }, [readOnly]);

  useEffect(() => {
    setCurrentLabel(label);
  }, [label]);
  useEffect(() => {
    const element = textRef.current;
    if (element && element.textContent !== currentLabel) {
      element.textContent = currentLabel;
    }
  }, [currentLabel]);

  useEffect(() => {
    const textParentEle = textRef.current?.parentElement;
    if (textParentEle) {
      const { clientWidth, clientHeight } = textParentEle;
      if (["left", "right"].includes(direction)) {
        const rect = {
          width: clientWidth,
          height: view.height,
          x: direction === "left" ? -clientWidth : view.width,
          y: 0,
        };
        setTitleForeignRect(rect);
      } else {
        const rect = {
          width: view.width,
          height: clientHeight,
          x: 0,
          y: direction === "top" ? -clientHeight : view.height,
        };
        setTitleForeignRect(rect);
      }
    }
  }, [view, currentLabel, direction, recomputation]);

  useEffect(() => {
    if (editingLabel && textRef.current) {
      textRef.current.focus();
      selectAllText(textRef.current);
    }
    onDecoratorTextEditing?.({ id: cell.id, editing: editingLabel });
  }, [cell.id, editingLabel, onDecoratorTextEditing]);

  useEffect(() => {
    if (shouldEmitLabelChange) {
      onDecoratorTextChange?.({
        id: cell.id,
        view: { ...view, text: currentLabel },
      });
      setShouldEmitLabelChange(false);
    }
  }, [cell, view, currentLabel, onDecoratorTextChange, shouldEmitLabelChange]);

  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    if (!resizeHandle || readOnly) {
      return;
    }
    const onMouseDown = (event: MouseEvent) => {
      handleMouseDown(event, {
        action: "resize",
        cell,
        scale: transform.k,
        activeTarget,
        cells,
        onCellResizing,
        onCellResized,
        onSwitchActiveTarget,
      });
    };
    resizeHandle.addEventListener("mousedown", onMouseDown);
    return () => {
      resizeHandle.removeEventListener("mousedown", onMouseDown);
    };
  }, [
    activeTarget,
    cell,
    cells,
    onCellResized,
    onCellResizing,
    onSwitchActiveTarget,
    readOnly,
    transform.k,
  ]);

  return (
    <g className="decorator-container">
      <foreignObject {...titleForeignRect}>
        <div
          className={classNames("text-container", {
            editing: editingLabel,
            [["left", "right"].includes(direction) ? "vertical" : "horizontal"]:
              true,
          })}
          onDoubleClick={handleEnableEdit}
        >
          <div
            className="text"
            contentEditable={editingLabel}
            ref={textRef}
            onInput={handleInput}
            onBlur={handleBlur}
          />
        </div>
      </foreignObject>
      <rect width={view.width} height={view.height} className="container" />
      {!readOnly && !isNoManualLayout(layout) && (
        <g
          ref={resizeHandleRef}
          className="resize-handle"
          transform={`translate(${view.width - 20} ${view.height - 20})`}
        >
          <rect width={20} height={20} />
          <path d="M10 18L18 10 M15 18L18 15" />
        </g>
      )}
    </g>
  );
}
