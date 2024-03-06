import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BasicDecoratorProps } from "../interfaces";
import classNames from "classnames";

export type DecoratorTextProps = Pick<
  BasicDecoratorProps,
  "cell" | "onDecoratorTextEditing" | "onDecoratorTextChange"
>;

export function DecoratorText({
  cell,
  onDecoratorTextEditing,
  onDecoratorTextChange,
}: DecoratorTextProps): JSX.Element {
  const label = cell.view.text ?? "";
  const [currentLabel, setCurrentLabel] = useState<string>(label);
  const [editingLabel, setEditingLabel] = useState(false);
  const editingLabelInitialized = useRef(false);
  const [shouldEmitLabelChange, setShouldEmitLabelChange] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleEnableEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLabel(true);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element && element.textContent !== currentLabel) {
      element.textContent = currentLabel;
    }
  }, [currentLabel]);

  useEffect(() => {
    if (editingLabel && ref.current) {
      ref.current.focus();
      selectAllText(ref.current);
    }
    onDecoratorTextEditing({ id: cell.id, editing: editingLabel });
  }, [cell.id, editingLabel, onDecoratorTextEditing]);

  useEffect(() => {
    if (editingLabelInitialized.current) {
      onDecoratorTextEditing?.({ id: cell.id, editing: editingLabel });
    } else {
      editingLabelInitialized.current = true;
    }
  }, [cell.id, editingLabel, onDecoratorTextEditing]);

  const handleInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
    setCurrentLabel((event.target as HTMLDivElement).textContent!);
  }, []);

  const handleBlur = useCallback(() => {
    setEditingLabel(false);
    setShouldEmitLabelChange(true);
  }, []);

  useEffect(() => {
    if (shouldEmitLabelChange) {
      onDecoratorTextChange?.({
        id: cell.id,
        view: { ...cell.view, text: currentLabel },
      });
      setShouldEmitLabelChange(false);
    }
  }, [cell, currentLabel, onDecoratorTextChange, shouldEmitLabelChange]);

  return (
    <foreignObject className="decorator-text">
      <div
        className={classNames("text-container", { editing: editingLabel })}
        onDoubleClick={handleEnableEdit}
      >
        <div
          className="text"
          contentEditable={editingLabel}
          ref={ref}
          onInput={handleInput}
          onBlur={handleBlur}
        />
      </div>
    </foreignObject>
  );
}

function selectAllText(element: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
}
