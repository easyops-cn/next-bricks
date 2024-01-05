import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const autoFocusedSets = new Set<string>();

export interface PageArchNodeProps {
  label?: string;
  type?: PageArchNodeType;
  active?: boolean;
  external?: ExternalData;
  autoFocusOnce?: string;
  notSynced?: boolean;
  disableChildAppend?: boolean;
}

export interface ExternalData {
  label: string;
  id: string;
}

export type PageArchNodeType = "page" | "board";

/**
 * 构件 `visual-builder.page-arch-node`
 */
export
@defineElement("visual-builder.page-arch-node", {
  styleTexts: [styleText],
})
class PageArchNode extends ReactNextElement implements PageArchNodeProps {
  @property()
  accessor label: string | undefined;

  @property()
  accessor type: PageArchNodeType | undefined;

  @property({ attribute: false })
  accessor external: ExternalData | undefined;

  // @property()
  // accessor thumbnail: string | undefined;

  @property({ type: Boolean, render: false })
  accessor active: boolean | undefined;

  @property({ type: Boolean, render: false })
  accessor notSynced: boolean | undefined;

  @property({ type: Boolean, render: false })
  accessor disableChildAppend: boolean | undefined;

  @property()
  accessor autoFocusOnce: string | undefined;

  @event({ type: "label.editing.change" })
  accessor #labelEditingChange: EventEmitter<boolean>;

  #handleLabelEditingChange = (value: boolean) => {
    this.#labelEditingChange.emit(value);
  };

  @event({ type: "label.change" })
  accessor #labelChange: EventEmitter<string>;

  #handleLabelChange = (value: string) => {
    this.#labelChange.emit(value);
  };

  @event({ type: "child.append" })
  accessor #childAppend: EventEmitter<void>;

  #handleChildAppend = () => {
    this.#childAppend.emit();
  };

  @event({ type: "external.click" })
  accessor #externalClick: EventEmitter<ExternalData>;

  #handleExternalClick = (data: ExternalData) => {
    this.#externalClick.emit(data);
  };

  render() {
    return (
      <PageArchNodeComponent
        label={this.label}
        type={this.type}
        external={this.external}
        autoFocusOnce={this.autoFocusOnce}
        onLabelEditingChange={this.#handleLabelEditingChange}
        onLabelChange={this.#handleLabelChange}
        onChildAppend={this.#handleChildAppend}
        onExternalClick={this.#handleExternalClick}
      />
    );
  }
}

export interface PageArchNodeComponentProps extends PageArchNodeProps {
  onLabelEditingChange?(value: boolean): void;
  onLabelChange?(value: string): void;
  onChildAppend?(): void;
  onExternalClick?(data: ExternalData): void;
}

export function PageArchNodeComponent({
  label,
  type: _type,
  external,
  autoFocusOnce,
  onLabelEditingChange,
  onLabelChange,
  onChildAppend,
  onExternalClick,
}: PageArchNodeComponentProps) {
  const type = _type === "board" ? "board" : "page";
  const [currentLabel, setCurrentLabel] = useState(label);
  const [editingLabel, setEditingLabel] = useState(false);
  const editingLabelInitialized = useRef(false);
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
    if (autoFocusOnce && !autoFocusedSets.has(autoFocusOnce)) {
      autoFocusedSets.add(autoFocusOnce);
      setTimeout(() => {
        setEditingLabel(true);
      }, 1);
    }
  }, [autoFocusOnce]);

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

  const handleChildAppend = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChildAppend?.();
    },
    [onChildAppend]
  );

  const handleExternalClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onExternalClick?.(external);
    },
    [external, onExternalClick]
  );

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <div
        className={classNames("node", type, { "editing-label": editingLabel })}
      >
        <input
          className="label-input"
          value={currentLabel}
          ref={labelInputRef}
          onChange={handleInputChange}
          onKeyDown={handleInputKeydown}
          onBlur={handleInputBlur}
          onContextMenu={stopPropagation}
          onMouseDown={stopPropagation}
        />
        <div
          className="label"
          onDoubleClick={handleEditLabel}
          onMouseDown={stopPropagation}
        >
          {currentLabel}
        </div>
        {type === "board" ? (
          <div className="icon-container">
            <WrappedIcon lib="antd" icon="unordered-list" />
          </div>
        ) : (
          <div className="thumbnail-container">
            <WrappedIcon lib="antd" icon="ellipsis" />
            {external && (
              <div
                className="external"
                onClick={handleExternalClick}
                onDoubleClick={stopPropagation}
                onMouseDown={stopPropagation}
              >
                <WrappedIcon lib="antd" icon="desktop" />
                <span className="external-label">{external.label}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className="add-button"
        role="button"
        onClick={handleChildAppend}
        onMouseDown={stopPropagation}
      >
        <WrappedIcon lib="fa" icon="plus" />
      </div>
    </>
  );
}
