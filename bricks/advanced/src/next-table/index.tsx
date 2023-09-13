import React from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { NextTableComponent } from "./Table.js";
import { Column, DataSource, PaginationType } from "./interface.js";

const { defineElement, property, event } = createDecorators();

/**
 * 大型表格
 */
export
@defineElement("eo-next-table", {
  styleTexts: [styleText],
})
class EoNextTable extends ReactNextElement {
  @property({
    attribute: false,
  })
  accessor columns: Column[] | undefined;

  @property({
    attribute: false,
  })
  accessor dataSource: DataSource | undefined;

  @property({
    attribute: false,
  })
  accessor pagination: PaginationType | undefined;

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

  render() {
    return (
      <NextTableComponent
        shadowRoot={this.shadowRoot}
        columns={this.columns}
        dataSource={this.dataSource}
        pagination={this.pagination}
        onPageChange={this.#handlePageChange}
        onPageSizeChange={this.#handlePageSizeChange}
      />
    );
  }
}
