import React, { createRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { NextTableComponent, NextTableComponentRef } from "./Table.js";
import {
  Column,
  DataSource,
  PaginationType,
  RecordType,
  RowSelectionType,
} from "./interface.js";
import { RowSelectMethod } from "antd/es/table/interface.js";

const { defineElement, property, method, event } = createDecorators();

/**
 * 大型表格
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
   * 数据源
   */
  @property({
    attribute: false,
  })
  accessor dataSource: DataSource | undefined;

  /**
   * 分页配置
   */
  @property({
    attribute: false,
  })
  accessor pagination: PaginationType;

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
   * 进行前端搜索的字段，支持嵌套的写法。不配置的时候默认为对所有 column.dataIndex 进行前端搜索
   */
  @property({
    attribute: false,
  })
  accessor searchFields: (string | string[])[] | undefined;

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

  render() {
    return (
      <NextTableComponent
        ref={this.#tableRef}
        shadowRoot={this.shadowRoot}
        rowKey={this.rowKey}
        columns={this.columns}
        dataSource={this.dataSource}
        pagination={this.pagination}
        rowSelection={this.rowSelection}
        selectedRowKeys={this.selectedRowKeys}
        hiddenColumns={this.hiddenColumns}
        searchFields={this.searchFields}
        onPageChange={this.#handlePageChange}
        onPageSizeChange={this.#handlePageSizeChange}
        onRowSelect={this.#handleRowSelect}
      />
    );
  }
}
