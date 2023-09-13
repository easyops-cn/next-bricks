import type { ColumnType, TablePaginationConfig } from "antd/es/table";
import type { UseBrickConf } from "@next-core/types";

export type RecordType = Record<string, any>;

export interface Column extends ColumnType<RecordType> {
  /** 表头自定义展示构件 */
  headerBrick?: {
    useBrick: UseBrickConf;
  };
  /** 内容自定义展示构件 */
  useBrick?: UseBrickConf;
}

export interface DataSource {
  list?: RecordType[];
  total?: number;
  page?: number;
  pageSize?: number;
}

interface PaginationConfig
  extends Pick<
    TablePaginationConfig,
    | "disabled"
    | "hideOnSinglePage"
    | "pageSizeOptions"
    | "responsive"
    | "showLessItems"
    | "showQuickJumper"
    | "showSizeChanger"
    | "showTitle"
    | "simple"
    | "size"
  > {
  showTotal?: boolean;
}

export type PaginationType = false | PaginationConfig | undefined;
