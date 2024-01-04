import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface EditableLabelProps {
  label?: string;
  type?: LabelType;
}

export type LabelType = "line" | "default";

/**
 * 构件 `diagram.editable-label`
 */
export
@defineElement("diagram.editable-label", {
  styleTexts: [styleText],
})
class EditableLabel extends ReactNextElement implements EditableLabelProps {
  @property()
  accessor label: string | undefined;

  @property({ render: false })
  accessor type: LabelType | undefined;

  @event({ type: "label.change" })
  accessor #labelChange!: EventEmitter<string>;

  #handleLabelChange = (value: string) => {
    this.#labelChange.emit(value);
  };

  render() {
    return (
      <EditableLabelComponent
        label={this.label}
        onLabelChange={this.#handleLabelChange}
      />
    );
  }
}

export interface EditableLabelComponentProps extends EditableLabelProps {
  onLabelChange?(value: string): void;
}

export function EditableLabelComponent({
  label: _label,
  onLabelChange,
}: EditableLabelComponentProps) {
  const label = _label ?? "";
  const [currentLabel, setCurrentLabel] = useState<string>(label);
  const [editingLabel, setEditingLabel] = useState(false);
  const [shouldEmitLabelChange, setShouldEmitLabelChange] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentLabel(label);
  }, [label]);

  const handleEditLabel = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLabel(true);
  }, []);

  useEffect(() => {
    if (editingLabel) {
      // Prevent scroll when focusing.
      // Otherwise the diagram svg may be clipped in Chrome.
      labelInputRef.current?.focus({ preventScroll: true });
      labelInputRef.current?.select();
    }
  }, [editingLabel]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLabel(event.target.value);
    },
    []
  );

  const handleInputKeydown = useCallback((event: React.KeyboardEvent) => {
    const key =
      event.key ||
      /* istanbul ignore next: compatibility */ event.keyCode ||
      /* istanbul ignore next: compatibility */ event.which;
    if (key === "Enter" || key === 13) {
      labelInputRef.current?.blur();
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    setEditingLabel(false);
    setShouldEmitLabelChange(true);
  }, []);

  useEffect(() => {
    if (shouldEmitLabelChange) {
      onLabelChange?.(currentLabel);
      setShouldEmitLabelChange(false);
    }
  }, [currentLabel, onLabelChange, shouldEmitLabelChange]);

  return (
    <div className={classNames("label", { editing: editingLabel })}>
      <input
        className="label-input"
        value={currentLabel}
        ref={labelInputRef}
        onChange={handleInputChange}
        onKeyDown={handleInputKeydown}
        onBlur={handleInputBlur}
      />
      <div className="label-text" onDoubleClick={handleEditLabel}>
        {currentLabel}
      </div>
    </div>
  );
}
