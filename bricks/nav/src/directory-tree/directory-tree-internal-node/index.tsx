import React, { useEffect, useRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import Arrow from "./arrow.svg";
import { IndentSize } from "../constants";

const { defineElement, property, event } = createDecorators();

export interface EoDirectoryTreeInternalNodeProps {
  depth: number;
  expanded?: boolean;
  selectable?: boolean;
  selected?: boolean;
}

export interface EoDirectoryTreeInternalNodeEvents {
  expand: CustomEvent<boolean>;
  select: CustomEvent<void>;
}

export interface EoDirectoryTreeInternalNodeEventsMap {
  onExpand: "expand";
  onSelect: "select";
}

/**
 * 目录树节点节点
 */
export
@defineElement("eo-directory-tree-internal-node", {
  styleTexts: [styleText],
})
class EoDirectoryTreeInternalNode extends ReactNextElement {
  /**
   * 深度
   */
  @property({
    type: Number,
  })
  accessor depth: number = 0;

  /**
   * 是否展开
   */
  @property({
    type: Boolean,
  })
  accessor expanded: boolean | undefined;

  /**
   * 可选择
   */
  @property({
    type: Boolean,
  })
  accessor selectable: boolean | undefined;

  /**
   * 是否选中
   */
  @property({
    type: Boolean,
  })
  accessor selected: boolean | undefined;

  /**
   * 展开事件
   * @detail 展开状态
   */
  @event({ type: "expand" })
  accessor #expandEvent!: EventEmitter<boolean>;
  #handleExpand = () => {
    this.#expandEvent.emit(!this.expanded);
  };

  /**
   * 选择事件
   */
  @event({ type: "select" })
  accessor #selectEvent!: EventEmitter<void>;
  #handleSelect = () => {
    this.#selectEvent.emit();
  };

  render() {
    return (
      <EoDirectoryTreeInternalNodeComponent
        depth={this.depth}
        selectable={this.selectable}
        expanded={this.expanded}
        onExpand={this.#handleExpand}
        onSelect={this.#handleSelect}
      />
    );
  }
}

export interface EoDirectoryTreeInternalNodeComponentProps
  extends EoDirectoryTreeInternalNodeProps {
  onExpand: () => void;
  onSelect: () => void;
}

export function EoDirectoryTreeInternalNodeComponent(
  props: EoDirectoryTreeInternalNodeComponentProps
) {
  const { depth, selectable, onExpand, onSelect } = props;

  const treeItemRef = useRef<HTMLDivElement>(null);
  const expandBottomRef = useRef<HTMLDivElement>(null);
  const suffixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectable) {
      const treeItem = treeItemRef.current;
      const expandBottom = expandBottomRef.current;
      const handleSelect = () => {
        onSelect();
      };
      const handleExpand = (e: MouseEvent) => {
        e.stopPropagation();
        onExpand();
      };

      treeItem?.addEventListener("click", handleSelect);
      expandBottom?.addEventListener("click", handleExpand);

      return () => {
        treeItem?.removeEventListener("click", handleSelect);
        expandBottom?.removeEventListener("click", handleExpand);
      };
    } else {
      const treeItem = treeItemRef.current;
      const handleExpand = () => {
        onExpand();
      };

      treeItem?.addEventListener("click", handleExpand);

      return () => {
        treeItem?.removeEventListener("click", handleExpand);
      };
    }
  }, [selectable, onSelect, onExpand]);

  useEffect(() => {
    const suffix = suffixRef.current;
    const handleSuffixClick = (e: MouseEvent) => {
      e.stopPropagation();
    };

    suffix?.addEventListener("click", handleSuffixClick);

    return () => {
      suffix?.removeEventListener("click", handleSuffixClick);
    };
  }, []);

  return (
    <>
      <div className="tree-item" ref={treeItemRef}>
        <div
          className="tree-item-indentation"
          style={{
            width: IndentSize * depth,
          }}
        />
        <div className="tree-item-content">
          <div className="tree-item-expand-button" ref={expandBottomRef}>
            <Arrow className="tree-item-expand-arrow" />
          </div>
          <div className="tree-item-label">
            <slot name="label" />
          </div>
        </div>
        <div className="tree-item-suffix" ref={suffixRef}>
          <slot name="suffix" />
        </div>
      </div>
      <div className="tree-item-children">
        <div className="tree-item-inner">
          <slot />
        </div>
      </div>
    </>
  );
}
