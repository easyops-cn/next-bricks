import React, { useEffect, useRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { IndentSize } from "../constants";

const { defineElement, property, event } = createDecorators();

export interface EoDirectoryTreeLeafProps {
  depth: number;
  selected?: boolean;
}

export interface EoDirectoryTreeLeafEvents {
  select: CustomEvent<void>;
}

export interface EoDirectoryTreeLeafEventsMap {
  onSelect: "select";
}

/**
 * 目录树叶子节点
 */
export
@defineElement("eo-directory-tree-leaf", {
  styleTexts: [styleText],
})
class EoDirectoryTreeLeaf extends ReactNextElement {
  /**
   * 深度
   */
  @property({
    type: Number,
  })
  accessor depth: number = 0;

  /**
   * 是否选中
   */
  @property({
    type: Boolean,
  })
  accessor selected: boolean | undefined;

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
      <EoDirectoryTreeLeafComponent
        depth={this.depth}
        onSelect={this.#handleSelect}
      />
    );
  }
}

export interface EoDirectoryTreeLeafComponentProps
  extends EoDirectoryTreeLeafProps {
  onSelect: () => void;
}

export function EoDirectoryTreeLeafComponent(
  props: EoDirectoryTreeLeafComponentProps
) {
  const { depth, onSelect } = props;

  const treeItemRef = useRef<HTMLDivElement>(null);
  const suffixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const treeItem = treeItemRef.current;
    const handleSelect = () => {
      onSelect();
    };

    treeItem?.addEventListener("click", handleSelect);

    return () => {
      treeItem?.removeEventListener("click", handleSelect);
    };
  }, [onSelect]);

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
    <div className="tree-item" ref={treeItemRef}>
      <div
        className="tree-item-indentation"
        style={{
          width: IndentSize * depth,
        }}
      />
      <div className="tree-item-content">
        <div className="tree-item-expand-button"></div>
        <div className="tree-item-label">
          <slot />
        </div>
      </div>
      <div className="tree-item-suffix" ref={suffixRef}>
        <slot name="suffix" />
      </div>
    </div>
  );
}
