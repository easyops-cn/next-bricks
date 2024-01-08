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
}

export interface EoDirectoryTreeInternalNodeEvents {
  expand: CustomEvent<boolean>;
}

export interface EoDirectoryTreeInternalNodeEventsMap {
  onExpand: "expand";
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
   * 展开事件
   * @detail 展开状态
   */
  @event({ type: "expand" })
  accessor #expandEvent!: EventEmitter<boolean>;
  #handleExpand = () => {
    this.#expandEvent.emit(!this.expanded);
  };

  render() {
    return (
      <EoDirectoryTreeInternalNodeComponent
        depth={this.depth}
        expanded={this.expanded}
        onExpand={this.#handleExpand}
      />
    );
  }
}

export interface EoDirectoryTreeInternalNodeComponentProps
  extends EoDirectoryTreeInternalNodeProps {
  onExpand: () => void;
}

export function EoDirectoryTreeInternalNodeComponent(
  props: EoDirectoryTreeInternalNodeComponentProps
) {
  const { depth, onExpand } = props;

  const expandableContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const expandableContent = expandableContentRef.current;
    const handleExpand = () => {
      onExpand();
    };

    expandableContent?.addEventListener("click", handleExpand);

    return () => {
      expandableContent?.removeEventListener("click", handleExpand);
    };
  }, [onExpand]);

  return (
    <>
      <div className="tree-item">
        <div
          className="tree-item-indentation"
          style={{
            width: IndentSize * depth,
          }}
        />
        <div className="tree-item-content">
          <div
            className="tree-item-expandable-content"
            ref={expandableContentRef}
          >
            <div className="tree-item-expand-button">
              <Arrow className="tree-item-expand-arrow" />
            </div>
            <div className="tree-item-label">
              <slot name="label" />
            </div>
          </div>
          <div className="tree-item-suffix">
            <slot name="suffix" />
          </div>
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
