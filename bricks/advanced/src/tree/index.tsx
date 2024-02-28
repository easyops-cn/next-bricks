import React, { useMemo } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { Tree, ConfigProvider, theme } from "antd";
import type { TreeProps } from "antd";
import type { BasicDataNode } from "antd/es/tree";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { DownOutlined } from "@ant-design/icons";
import {
  useCurrentTheme,
  ReactUseMultipleBricks,
} from "@next-core/react-runtime";
import { UseBrickConf } from "@next-core/types";
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
  nodeDraggable?: boolean | { icon?: false };
  switcherIcon?: "auto" | "chevron" | false;
  allowDrop?: (info: AllowDropInfo) => boolean;
  titleSuffixBrick?: { useBrick: UseBrickConf };
}

export interface TreeNode extends BasicDataNode {
  title: string;
  key: TreeNodeKey;
  children?: TreeNode[];
}

export type TreeNodeKey = string | number;

export interface CheckDetail {
  checkedKeys: TreeNodeKey[];
  halfCheckedKeys: TreeNodeKey[];
}

export interface AllowDropInfo {
  dragNode: TreeNode;
  dropNode: TreeNode;
  /**
   * The drop position is relative to the drop node, inside 0, top -1, bottom 1
   */
  dropPosition: number;
}

export interface DropDetail {
  dragNode: TreeNode;
  dropNode: TreeNode;
  /**
   * The drop position is relative to the drop node, inside 0, top -1, bottom 1
   */
  dropPosition: number;
}

export type RawDropInfo = Parameters<
  Exclude<TreeProps<TreeNode>["onDrop"], undefined>
>[0];

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
  accessor nodeDraggable: boolean | { icon?: false } | undefined;

  @property({ attribute: false })
  accessor switcherIcon: "auto" | "chevron" | false | undefined;

  @property({ attribute: false })
  accessor allowDrop: ((info: AllowDropInfo) => boolean) | undefined;

  @property({ attribute: false })
  accessor titleSuffixBrick: { useBrick: UseBrickConf } | undefined;

  @event({ type: "check" })
  accessor #checkEvent!: EventEmitter<TreeNodeKey[]>;

  @event({ type: "check.detail" })
  accessor #checkDetailEvent!: EventEmitter<CheckDetail>;

  #handleCheck: TreeProps<TreeNode>["onCheck"] = (checkedKeys, info) => {
    this.#checkEvent.emit(checkedKeys as TreeNodeKey[]);
    this.#checkDetailEvent.emit({
      checkedKeys: checkedKeys as TreeNodeKey[],
      halfCheckedKeys: info.halfCheckedKeys as TreeNodeKey[],
    });
  };

  @event({ type: "expand" })
  accessor #expandEvent!: EventEmitter<TreeNodeKey[]>;

  #handleExpand: TreeProps<TreeNode>["onExpand"] = (expandedKeys) => {
    this.#expandEvent.emit(expandedKeys as TreeNodeKey[]);
  };

  @event({ type: "node.drop" })
  accessor #dropEvent!: EventEmitter<DropDetail>;

  // istanbul ignore next
  #handleDrop = ({ dragNode, node: dropNode, dropPosition }: RawDropInfo) => {
    this.#dropEvent.emit({
      dragNode,
      dropNode,
      dropPosition,
    });
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
        nodeDraggable={this.nodeDraggable}
        switcherIcon={this.switcherIcon}
        expandedKeys={this.expandedKeys}
        checkedKeys={this.checkedKeys}
        titleSuffixBrick={this.titleSuffixBrick}
        onCheck={this.#handleCheck}
        onExpand={this.#handleExpand}
        allowDrop={this.allowDrop}
        onDrop={this.#handleDrop}
      />
    );
  }
}

export interface EoTreeComponentProps extends EoTreeProps {
  shadowRoot: ShadowRoot;
  onCheck: TreeProps<TreeNode>["onCheck"];
  onExpand: TreeProps<TreeNode>["onExpand"];
  onDrop: TreeProps<TreeNode>["onDrop"];
  allowDrop?: (info: AllowDropInfo) => boolean;
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
  nodeDraggable,
  switcherIcon,
  titleSuffixBrick,
  onCheck,
  onExpand,
  onDrop,
  allowDrop,
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
          {...(titleSuffixBrick?.useBrick
            ? {
                titleRender: (nodeData: TreeNode) => {
                  return (
                    <>
                      {nodeData.title}
                      <span onClick={(e) => e.stopPropagation()}>
                        <ReactUseMultipleBricks
                          useBrick={titleSuffixBrick.useBrick}
                          data={nodeData}
                        />
                      </span>
                    </>
                  );
                },
              }
            : null)}
          treeData={dataSource}
          checkable={checkable}
          selectable={selectable}
          defaultExpandAll={defaultExpandAll}
          showLine={showLine}
          draggable={nodeDraggable}
          {...(expandedKeys ? { expandedKeys } : null)}
          {...(checkedKeys ? { checkedKeys } : null)}
          onCheck={onCheck}
          onExpand={onExpand}
          allowDrop={allowDrop}
          onDrop={onDrop}
        />
      </StyleProvider>
    </ConfigProvider>
  );
}
