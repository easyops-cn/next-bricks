import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { BasicDecoratorProps } from "../interfaces";
import { handleMouseDown } from "../processors/handleMouseDown";
import classNames from "classnames";
import { get } from "lodash";
import { selectAllText } from "./DecoratorText";

export function DecoratorContainer({
  cell,
  transform,
  readOnly,
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
  const titleForeignRef = useRef({
    x: 0,
    y: 0,
    width: cell.view.width,
    height: cell.view.height,
  });
  const textRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = React.useRef<SVGGElement>(null);
  const [editingLabel, setEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string>(label);
  const [shouldEmitLabelChange, setShouldEmitLabelChange] = useState(false);

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
  }, [readOnly]);

  useLayoutEffect(() => {
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
        titleForeignRef.current = {
          width: clientWidth,
          height: cell.view.height,
          x: direction === "left" ? -clientWidth : cell.view.width,
          y: 0,
        };
      } else {
        titleForeignRef.current = {
          width: cell.view.width,
          height: clientHeight,
          x: 0,
          y: direction === "top" ? -clientHeight : cell.view.height,
        };
      }
    }
  }, [cell.view.width, cell.view.height, currentLabel, direction]);

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
        view: { ...cell.view, text: currentLabel },
      });
      setShouldEmitLabelChange(false);
    }
  }, [cell, currentLabel, onDecoratorTextChange, shouldEmitLabelChange]);
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
      <foreignObject {...titleForeignRef.current}>
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
      <rect
        width={cell.view.width}
        height={cell.view.height}
        className="container"
      />
      {!readOnly && (
        <g
          ref={resizeHandleRef}
          className="resize-handle"
          transform={`translate(${cell.view.width - 20} ${cell.view.height - 20})`}
        >
          <rect width={20} height={20} />
          <path d="M10 18L18 10 M15 18L18 15" />
        </g>
      )}
    </g>
  );
}
