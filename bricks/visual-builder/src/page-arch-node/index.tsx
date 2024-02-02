import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import classNames from "classnames";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

const autoFocusedSets = new Set<string>();

export interface PageArchNodeProps {
  label?: string;
  type?: PageArchNodeType;
  active?: boolean;
  external?: ExtraNodeData;
  subNodes?: ExtraNodeData[];
  autoFocusOnce?: string;
  notSynced?: boolean;
  disableChildAppend?: boolean;
}

export interface ExtraNodeData {
  label: string;
  id: string;
}

export interface SubNodeContextMenuData extends ContextMenuDetail {
  node: ExtraNodeData;
}

export interface ContextMenuDetail {
  clientX: number;
  clientY: number;
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
  accessor external: ExtraNodeData | undefined;

  @property({ attribute: false })
  accessor subNodes: ExtraNodeData[] | undefined;

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

  @event({ type: "node.click" })
  accessor #nodeClick: EventEmitter<void>;

  #handleNodeClick = () => {
    this.#nodeClick.emit();
  };

  @event({ type: "node.dblclick" })
  accessor #nodeDoubleClick: EventEmitter<void>;

  #handleNodeDoubleClick = () => {
    this.#nodeDoubleClick.emit();
  };

  @event({ type: "node.contextmenu" })
  accessor #nodeContextMenu: EventEmitter<ContextMenuDetail>;

  #handleNodeContextMenu = (data: ContextMenuDetail) => {
    this.#nodeContextMenu.emit(data);
  };

  @event({ type: "child.append" })
  accessor #childAppend: EventEmitter<void>;

  #handleChildAppend = () => {
    this.#childAppend.emit();
  };

  @event({ type: "external.click" })
  accessor #externalClick: EventEmitter<ExtraNodeData>;

  #handleExternalClick = (data: ExtraNodeData) => {
    this.#externalClick.emit(data);
  };

  @event({ type: "subNode.dblclick" })
  accessor #subNodeDoubleClick: EventEmitter<ExtraNodeData>;

  #handleSubNodeDoubleClick = (data: ExtraNodeData) => {
    this.#subNodeDoubleClick.emit(data);
  };

  @event({ type: "subNode.contextmenu" })
  accessor #subNodeContextMenu: EventEmitter<SubNodeContextMenuData>;

  #handleSubNodeContextMenu = (data: SubNodeContextMenuData) => {
    this.#subNodeContextMenu.emit(data);
  };

  render() {
    return (
      <PageArchNodeComponent
        label={this.label}
        type={this.type}
        external={this.external}
        subNodes={this.subNodes}
        autoFocusOnce={this.autoFocusOnce}
        onLabelEditingChange={this.#handleLabelEditingChange}
        onLabelChange={this.#handleLabelChange}
        onNodeClick={this.#handleNodeClick}
        onNodeDoubleClick={this.#handleNodeDoubleClick}
        onNodeContextMenu={this.#handleNodeContextMenu}
        onChildAppend={this.#handleChildAppend}
        onExternalClick={this.#handleExternalClick}
        onSubNodeDoubleClick={this.#handleSubNodeDoubleClick}
        onSubNodeContextMenu={this.#handleSubNodeContextMenu}
      />
    );
  }
}

export interface PageArchNodeComponentProps extends PageArchNodeProps {
  onLabelEditingChange?(value: boolean): void;
  onLabelChange?(value: string): void;
  onNodeClick?(): void;
  onNodeDoubleClick?(): void;
  onNodeContextMenu?(data: ContextMenuDetail): void;
  onChildAppend?(): void;
  onExternalClick?(data: ExtraNodeData): void;
  onSubNodeDoubleClick?(data: ExtraNodeData): void;
  onSubNodeContextMenu?(data: SubNodeContextMenuData): void;
}

export function PageArchNodeComponent({
  label,
  type: _type,
  external,
  subNodes,
  autoFocusOnce,
  onLabelEditingChange,
  onLabelChange,
  onNodeClick,
  onNodeDoubleClick,
  onNodeContextMenu,
  onChildAppend,
  onExternalClick,
  onSubNodeDoubleClick,
  onSubNodeContextMenu,
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

  // 32 + 8
  const extraHeight = Math.max(0, Math.floor((subNodes?.length ?? 0) - 3)) * 38;

  return (
    <>
      <div
        className={classNames("node", type, { "editing-label": editingLabel })}
        style={{ height: type === "board" ? 70 : 130 + extraHeight }}
        onClick={onNodeClick}
        onDoubleClick={onNodeDoubleClick}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onNodeContextMenu?.({
            clientX: e.clientX,
            clientY: e.clientY,
          });
        }}
      >
        <input
          className="label-input"
          value={currentLabel}
          ref={labelInputRef}
          onChange={handleInputChange}
          onKeyDown={handleInputKeydown}
          onBlur={handleInputBlur}
          onDoubleClick={stopPropagation}
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
          <div
            className="thumbnail-container"
            style={{
              height: 98 + extraHeight,
            }}
          >
            <div className="thumbnail-placeholder">
              <WrappedIcon lib="antd" icon="ellipsis" />
            </div>
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
            {subNodes?.length ? (
              <div className="sub-nodes">
                {subNodes.map((subNode) => (
                  <SubNode
                    key={subNode.id}
                    subNode={subNode}
                    onSubNodeDoubleClick={onSubNodeDoubleClick}
                    onSubNodeContextMenu={onSubNodeContextMenu}
                  />
                ))}
              </div>
            ) : null}
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

export interface SubNodeProps {
  subNode: ExtraNodeData;
  onSubNodeDoubleClick?(data: ExtraNodeData): void;
  onSubNodeContextMenu?(data: SubNodeContextMenuData): void;
}

function SubNode({
  subNode,
  onSubNodeDoubleClick,
  onSubNodeContextMenu,
}: SubNodeProps) {
  return (
    <WrappedTooltip key={subNode.id} content={subNode.label}>
      <div
        className="sub-node"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onSubNodeDoubleClick?.(subNode);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onSubNodeContextMenu?.({
            node: subNode,
            clientX: e.clientX,
            clientY: e.clientY,
          });
        }}
      >
        <div className="sub-node-skeleton-title"></div>
        <div className="sub-node-skeleton-content"></div>
        <div className="sub-node-skeleton-button"></div>
      </div>
    </WrappedTooltip>
  );
}
