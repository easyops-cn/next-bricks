import React, { useMemo } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { Tree, ConfigProvider, theme } from "antd";
import type { TreeProps } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { DownOutlined } from "@ant-design/icons";
import { useCurrentTheme } from "@next-core/react-runtime";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface EoTreeProps {
  dataSource?: TreeNode[];
  checkable?: boolean;
  selectable?: boolean;
  defaultExpandAll?: boolean;
  showLine?: boolean;
  expandedKeys?: TreeNodeKey[];
  checkedKeys?: TreeNodeKey[];
  switcherIcon?: "auto" | "chevron" | false;
}

export interface TreeNode {
  title: string;
  key: TreeNodeKey;
  children?: TreeNode[];
}

export type TreeNodeKey = string | number;

export interface CheckDetail {
  checkedKeys: TreeNodeKey[];
  halfCheckedKeys: TreeNodeKey[];
}

/**
 * 树形构件
 * @author steve
 */
export
@defineElement("eo-tree", {
  styleTexts: [styleText],
})
class EoTree extends ReactNextElement implements EoTreeProps {
  @property({ attribute: false })
  accessor dataSource: TreeNode[] | undefined;

  @property({ type: Boolean })
  accessor checkable: boolean | undefined;

  /**
   * @default true
   */
  @property({ type: Boolean })
  accessor selectable: boolean | undefined;

  @property({ type: Boolean })
  accessor defaultExpandAll: boolean | undefined;

  @property({ type: Boolean })
  accessor showLine: boolean | undefined;

  @property({ attribute: false })
  accessor expandedKeys: TreeNodeKey[] | undefined;

  @property({ attribute: false })
  accessor checkedKeys: TreeNodeKey[] | undefined;

  @property({ attribute: false })
  accessor switcherIcon: "auto" | "chevron" | false | undefined;

  @event({ type: "check" })
  accessor #checkEvent!: EventEmitter<TreeNodeKey[]>;

  @event({ type: "check.detail" })
  accessor #checkDetailEvent!: EventEmitter<CheckDetail>;

  #handleCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    this.#checkEvent.emit(checkedKeys as TreeNodeKey[]);
    this.#checkDetailEvent.emit({
      checkedKeys: checkedKeys as TreeNodeKey[],
      halfCheckedKeys: info.halfCheckedKeys as TreeNodeKey[],
    });
  };

  @event({ type: "expand" })
  accessor #expandEvent!: EventEmitter<TreeNodeKey[]>;

  #handleExpand: TreeProps["onExpand"] = (expandedKeys) => {
    this.#expandEvent.emit(expandedKeys as TreeNodeKey[]);
  };

  render() {
    return (
      <EoTreeComponent
        dataSource={this.dataSource}
        shadowRoot={this.shadowRoot!}
        checkable={this.checkable}
        selectable={this.selectable}
        defaultExpandAll={this.defaultExpandAll}
        showLine={this.showLine}
        switcherIcon={this.switcherIcon}
        expandedKeys={this.expandedKeys}
        checkedKeys={this.checkedKeys}
        onCheck={this.#handleCheck}
        onExpand={this.#handleExpand}
      />
    );
  }
}

export interface EoTreeComponentProps extends EoTreeProps {
  shadowRoot: ShadowRoot;
  onCheck: TreeProps["onCheck"];
  onExpand: TreeProps["onExpand"];
}

export function EoTreeComponent({
  dataSource,
  shadowRoot,
  checkable,
  selectable,
  defaultExpandAll,
  showLine,
  expandedKeys,
  checkedKeys,
  switcherIcon,
  onCheck,
  onExpand,
}: EoTreeComponentProps) {
  const currentTheme = useCurrentTheme();

  const cache = useMemo(() => createCache(), []);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider
        container={shadowRoot}
        // Auto clear injected styles after unmount
        autoClear
        cache={cache}
        // Set hashPriority to "high" to disable `:where()` usage for compatibility
        hashPriority="high"
      >
        <Tree
          switcherIcon={
            switcherIcon === false ? (
              false
            ) : switcherIcon === "chevron" ? (
              <DownOutlined />
            ) : undefined
          }
          treeData={dataSource}
          checkable={checkable}
          selectable={selectable}
          defaultExpandAll={defaultExpandAll}
          showLine={showLine}
          {...(expandedKeys ? { expandedKeys } : null)}
          {...(checkedKeys ? { checkedKeys } : null)}
          onCheck={onCheck}
          onExpand={onExpand}
        />
      </StyleProvider>
    </ConfigProvider>
  );
}
