import React, { createRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { NextTableComponent, NextTableComponentRef } from "./Table.js";
import type {
  CellConfig,
  Column,
  DataSource,
  ExpandableType,
  PaginationType,
  RecordType,
  RowSelectionType,
  Sort,
} from "./interface.js";
import { RowSelectMethod } from "antd/es/table/interface.js";
import type { TableProps } from "antd/es/table";
import type { NextTableComponentProps } from "./Table.js";
import "./host-context.css";

const { defineElement, property, method, event } = createDecorators();

/**
 * 大型表格
 * @author nlicro
 * @category table
 */
export
@defineElement("eo-next-table", {
  styleTexts: [styleText],
})
class EoNextTable extends ReactNextElement {
  #tableRef = createRef<NextTableComponentRef>();

  /**
   * 指定表格行的 key
   */
  @property()
  accessor rowKey: string = "key";

  /**
   * 列定义
   */
  @property({
    attribute: false,
  })
  accessor columns: Column[] | undefined;

  /**
   * 单元格
   */
  @property({
    attribute: false,
  })
  accessor cell: CellConfig | undefined;

  /**
   * 数据源
   */
  @property({
    attribute: false,
  })
  accessor dataSource: DataSource | undefined;

  /**
   * 是否前端搜索
   */
  @property({
    type: Boolean,
  })
  accessor frontSearch: boolean | undefined;

  /**
   * 分页配置
   */
  @property({
    attribute: false,
  })
  accessor pagination: PaginationType;

  /**
   * 是否支持多列排序，前端搜索时需设置 column.sortPriority 优先级
   */
  @property({
    type: Boolean,
  })
  accessor multiSort: boolean | undefined;

  /**
   * 排序信息
   */
  @property({
    attribute: false,
  })
  accessor sort: Sort | Sort[] | undefined;

  /**
   * 表格行可选择配置
   */
  @property({
    attribute: false,
  })
  accessor rowSelection: RowSelectionType;

  /**
   * 选中项的 key
   */
  @property({
    attribute: false,
  })
  accessor selectedRowKeys: (string | number)[] | undefined;

  /**
   * 隐藏的列（输入对应的 column.key）
   */
  @property({
    attribute: false,
  })
  accessor hiddenColumns: (string | number)[] | undefined;

  /**
   * 表格行展开配置
   */
  @property({
    attribute: false,
  })
  accessor expandable: ExpandableType;

  /**
   * 展开项的 key
   */
  @property({
    attribute: false,
  })
  accessor expandedRowKeys: (string | number)[] | undefined;

  /**
   * 树形结构的列名
   */
  @property()
  accessor childrenColumnName: string = "children";

  /**
   * 表格行拖拽配置
   */
  @property({
    type: Boolean,
  })
  accessor rowDraggable: boolean | undefined;

  /**
   * 进行前端搜索的字段，支持嵌套的写法。不配置的时候默认为对所有 column.dataIndex 进行前端搜索
   */
  @property({
    attribute: false,
  })
  accessor searchFields: (string | string[])[] | undefined;

  /**
   * 表格大小
   */
  @property()
  accessor size: TableProps<RecordType>["size"] = "large";

  /**
   * 是否显示表头
   */
  @property({
    type: Boolean,
  })
  accessor showHeader: boolean = true;

  /**
   * 是否显示边框
   */
  accessor bordered: boolean | undefined;

  /**
   * 滚动配置
   */
  @property({
    attribute: false,
  })
  accessor scrollConfig: TableProps<RecordType>["scroll"] = { x: true };

  /**
   * 优化渲染的列（输入对应的 column.key）
   */
  @property({
    attribute: false,
  })
  accessor optimizedColumns: (string | number)[] | undefined;

  /**
   * 前端搜索
   */
  @method()
  search(params: { q: string }) {
    this.#tableRef.current?.search(params);
  }

  /**
   * page 或 pageSize 改变的回调
   * @detail 改变后的页码及每页条数
   */
  @event({ type: "page.change" })
  accessor #pageChangeEvent!: EventEmitter<{ page: number; pageSize: number }>;
  #handlePageChange = (detail: { page: number; pageSize: number }): void => {
    this.#pageChangeEvent.emit(detail);
  };

  /**
   * pageSize 变化的回调
   * @detail 改变后的页码及每页条数
   */
  @event({ type: "page.size.change" })
  accessor #pageSizeChangeEvent!: EventEmitter<{
    page: number;
    pageSize: number;
  }>;
  #handlePageSizeChange = (detail: {
    page: number;
    pageSize: number;
  }): void => {
    this.#pageSizeChangeEvent.emit(detail);
  };

  /**
   * 排序变化的回调
   * @detail 当前排序的信息
   */
  @event({ type: "sort.change" })
  accessor #sortChangeEvent!: EventEmitter<Sort | Sort[] | undefined>;
  #handleSort = (detail: Sort | Sort[] | undefined): void => {
    this.#sortChangeEvent.emit(detail);
  };

  /**
   * 行选中项发生变化时的回调
   * @detail 改变后的 rowKey 及行数据
   */
  @event({ type: "row.select" })
  accessor #rowSelectEvent!: EventEmitter<{
    keys: (string | number)[];
    rows: RecordType[];
    info: { type: RowSelectMethod };
  }>;
  #handleRowSelect = (detail: {
    keys: (string | number)[];
    rows: RecordType[];
    info: { type: RowSelectMethod };
  }): void => {
    this.#rowSelectEvent.emit(detail);
  };

  /**
   * 点击展开图标时触发
   * @detail 当前行的展开情况及数据
   */
  @event({ type: "row.expand" })
  accessor #rowExpandEvent!: EventEmitter<{
    expanded: boolean;
    record: RecordType;
  }>;
  #handleRowExpand = (detail: {
    expanded: boolean;
    record: RecordType;
  }): void => {
    this.#rowExpandEvent.emit(detail);
  };

  /**
   * 展开的行变化时触发
   * @detail 所有展开行的 key
   */
  @event({ type: "expanded.rows.change" })
  accessor #expandedRowsChangeEvent!: EventEmitter<(string | number)[]>;
  #handleExpandedRowsChange = (detail: (string | number)[]): void => {
    this.#expandedRowsChangeEvent.emit(detail);
  };

  /**
   * 表格行拖拽结束发生的事件
   * @detail 重新排序的行数据、拖拽的行数据、放下位置的行数据
   */
  @event({ type: "row.drag" })
  accessor #rowDragEvent!: EventEmitter<{
    list: RecordType[];
    active: RecordType;
    over: RecordType;
  }>;
  // istanbul ignore next
  #handleRowDrag = (detail: {
    list: RecordType[];
    active: RecordType;
    over: RecordType;
  }): void => {
    this.#rowDragEvent.emit(detail);
  };

  render() {
    return (
      <NextTableComponent
        ref={this.#tableRef}
        shadowRoot={this.shadowRoot}
        rowKey={this.rowKey}
        columns={this.columns}
        cell={this.cell}
        dataSource={this.dataSource}
        frontSearch={this.frontSearch}
        pagination={this.pagination}
        multiSort={this.multiSort}
        sort={this.sort}
        rowSelection={this.rowSelection}
        selectedRowKeys={this.selectedRowKeys}
        hiddenColumns={this.hiddenColumns}
        expandable={this.expandable}
        expandedRowKeys={this.expandedRowKeys}
        childrenColumnName={this.childrenColumnName}
        rowDraggable={this.rowDraggable}
        searchFields={this.searchFields}
        size={this.size}
        showHeader={this.showHeader}
        bordered={this.bordered}
        scrollConfig={this.scrollConfig}
        optimizedColumns={this.optimizedColumns}
        onPageChange={this.#handlePageChange}
        onPageSizeChange={this.#handlePageSizeChange}
        onSort={this.#handleSort}
        onRowSelect={this.#handleRowSelect}
        onRowExpand={this.#handleRowExpand}
        onExpandedRowsChange={this.#handleExpandedRowsChange}
        onRowDrag={this.#handleRowDrag}
      />
    );
  }
}

export { NextTableComponentProps };
