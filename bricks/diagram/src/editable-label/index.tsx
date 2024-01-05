import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface EditableLabelProps {
  label?: string;
  type?: LabelType;
}

export type LabelType = "line" | "default";

export interface EditableLabelRef {
  enableEditing(): void;
}

export const EditableLabelComponent = forwardRef(LegacyEditableLabelComponent);

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

  @event({ type: "label.editing.change" })
  accessor #labelEditingChange!: EventEmitter<boolean>;

  #handleLabelEditingChange = (value: boolean) => {
    this.#labelEditingChange.emit(value);
  };

  @event({ type: "label.change" })
  accessor #labelChange!: EventEmitter<string>;

  #handleLabelChange = (value: string) => {
    this.#labelChange.emit(value);
  };

  @method()
  enableEditing() {
    this.#editableLabelRef.current?.enableEditing();
  }

  #editableLabelRef = createRef<EditableLabelRef>();

  render() {
    return (
      <EditableLabelComponent
        ref={this.#editableLabelRef}
        label={this.label}
        onLabelEditingChange={this.#handleLabelEditingChange}
        onLabelChange={this.#handleLabelChange}
      />
    );
  }
}

export interface EditableLabelComponentProps extends EditableLabelProps {
  onLabelEditingChange?(value: boolean): void;
  onLabelChange?(value: string): void;
}

export function LegacyEditableLabelComponent(
  {
    label: _label,
    onLabelChange,
    onLabelEditingChange,
  }: EditableLabelComponentProps,
  ref: React.Ref<EditableLabelRef>
) {
  const label = _label ?? "";
  const [currentLabel, setCurrentLabel] = useState<string>(label);
  const [editingLabel, setEditingLabel] = useState(false);
  const editingLabelInitialized = useRef(false);
  const [shouldEmitLabelChange, setShouldEmitLabelChange] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    enableEditing() {
      setEditingLabel(true);
    },
  }));

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

  useEffect(() => {
    if (editingLabelInitialized.current) {
      onLabelEditingChange?.(editingLabel);
    } else {
      editingLabelInitialized.current = true;
    }
  }, [editingLabel, onLabelEditingChange]);

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
    <div
      className={classNames("label", {
        editing: editingLabel,
        empty: !currentLabel,
      })}
    >
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
