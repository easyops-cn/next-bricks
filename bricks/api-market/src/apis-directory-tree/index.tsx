import React, { useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { Tree } from "./Tree";
import {
  getFlattenTreeData,
  getAllExpandableKeys,
  getExpandableKeysAccordingToSelectedKeys,
  searchTree,
} from "./utils";
import { DirectoryTreeContext } from "./DirectoryTreeContext";
import { WrappedSearch } from "./wrapped-bricks";
import { SimpleActionType } from "@next-bricks/basic/mini-actions";

const { defineElement, property, method, event } = createDecorators();

/**
 * 传入的 data 类型
 */
export interface TreeItem {
  key: string;
  title: string;
  children?: TreeItem[];
  [key: string]: any;
}

/**
 * 内部格式化后的类型
 */
export interface TreeData {
  title: string;
  key: string;
  pos: string;
  depth: number;
  index: number;
  data: TreeItem;
  parent?: TreeData;
  children?: TreeData[];
}

/**
 * useBrick、事件使用的类型
 */
export interface NodeData {
  depth: number;
  index: number;
  data: TreeItem;
}

export interface ApisDirectoryTreeProps {
  data: TreeItem[];
  directoryTitle?: string;
  searchable?: boolean;
  placeholder?: string;
  selectedKeys?: string[];
  expandedKeys?: string[];
  searchFields?: (string | string[])[];
}

/**
 * API目录树
 */
export
@defineElement("api-market.apis-directory-tree", {
  styleTexts: [styleText],
})
class ApisDirectoryTree extends ReactNextElement {
  /**
   * 数据源
   */
  @property({
    attribute: false,
  })
  accessor data: TreeItem[] = [];

  /**
   * 目录标题
   */
  @property()
  accessor directoryTitle: string | undefined;

  /**
   * 可搜索
   */
  @property({
    type: Boolean,
  })
  accessor searchable: boolean | undefined;

  /**
   * 搜索占位说明
   */
  @property()
  accessor placeholder: string | undefined;

  /**
   * 除了 title 以外，额外的搜索字段
   */
  @property({
    attribute: false,
  })
  accessor searchFields: (string | string[])[] | undefined;

  /**
   * 选中的 keys
   */
  @property({
    attribute: false,
  })
  accessor selectedKeys: string[] | undefined;

  /**
   * 展开的 keys
   */
  @property({
    attribute: false,
  })
  accessor expandedKeys: string[] | undefined;

  /**
   * 展开全部
   */
  @method()
  expandAll() {
    this.expandedKeys = getAllExpandableKeys(this.data);
  }

  /**
   * 收起全部
   */
  @method()
  collapseAll() {
    this.expandedKeys = [];
  }

  /**
   * 根据选择项展开
   */
  @method()
  expandAccordingToSelectedKeys() {
    this.expandedKeys = getExpandableKeysAccordingToSelectedKeys(
      this.data,
      new Set(this.selectedKeys)
    );
  }

  /**
   * 展开事件
   * @detail keys - 展开的 keys
   */
  @event({ type: "expand" })
  accessor #expandEvent!: EventEmitter<{ keys: string[]; node: NodeData }>;
  #handleExpand = (data: { keys: string[]; node: NodeData }) => {
    this.expandedKeys = data.keys;
    this.#expandEvent.emit(data);
  };

  /**
   * 选择事件
   * @detail keys - 选择的 keys
   */
  @event({ type: "select" })
  accessor #selectEvent!: EventEmitter<{ keys: string[]; node: NodeData }>;
  #handleSelect = (data: { keys: string[]; node: NodeData }) => {
    this.selectedKeys = data.keys;
    this.#selectEvent.emit(data);
  };

  /**
   * actions点击事件
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<{
    data: NodeData;
    action: SimpleActionType;
  }>;
  #handleActionClick = (data: NodeData, action: SimpleActionType) => {
    this.#actionClickEvent.emit({ data, action });
  };

  render() {
    return (
      <ApisDirectoryTreeComponent
        element={this}
        data={this.data}
        directoryTitle={this.directoryTitle}
        placeholder={this.placeholder}
        searchable={this.searchable}
        searchFields={this.searchFields}
        selectedKeys={this.selectedKeys}
        expandedKeys={this.expandedKeys}
        onExpand={this.#handleExpand}
        onSelect={this.#handleSelect}
        onSuffixActionsClick={this.#handleActionClick}
      />
    );
  }
}

interface ApisDirectoryTreeComponentProps extends ApisDirectoryTreeProps {
  element: ApisDirectoryTree;
  onSuffixActionsClick: (data: NodeData, action: SimpleActionType) => void;
  onExpand: (data: { keys: string[]; node: NodeData }) => void;
  onSelect: (data: { keys: string[]; node: NodeData }) => void;
}

export function ApisDirectoryTreeComponent(
  props: ApisDirectoryTreeComponentProps
) {
  const {
    element,
    data,
    directoryTitle,
    searchable,
    searchFields,
    placeholder,
    onSelect,
    onExpand,
    onSuffixActionsClick,
  } = props;

  const expandedKeysSet = useMemo(
    () => new Set(props.expandedKeys),
    [props.expandedKeys]
  );
  const selectedKeysSet = useMemo(
    () => new Set(props.selectedKeys),
    [props.selectedKeys]
  );

  const [q, setQ] = useState("");

  const handleSearch = (e: CustomEvent<string>) => {
    setQ(e.detail);
  };

  const searchedData = useMemo(() => {
    const result = searchTree(data, q, (searchFields || []).concat("title"));
    if (q) {
      element.expandedKeys = result.expandedKeys;
    }
    return result.data;
  }, [data, q, searchFields]);

  const treeData = useMemo(() => {
    return getFlattenTreeData(searchedData, expandedKeysSet);
  }, [searchedData, expandedKeysSet]);

  return (
    <DirectoryTreeContext.Provider
      value={{
        expandedKeysSet,
        selectedKeysSet,
        onSelect,
        onExpand,
        onSuffixActionsClick,
      }}
    >
      <div className="directory-container">
        {directoryTitle && (
          <div className="directory-title-container">
            <div className="directory-title" title={directoryTitle}>
              {directoryTitle}
            </div>
            <div className="directory-title-toolbar">
              <slot name="toolbar" />
            </div>
          </div>
        )}
        {searchable && (
          <WrappedSearch
            className="directory-search"
            trim
            placeholder={placeholder}
            onSearch={handleSearch}
          />
        )}
        <div className="tree">
          <Tree treeData={treeData} />
        </div>
      </div>
    </DirectoryTreeContext.Provider>
  );
}
