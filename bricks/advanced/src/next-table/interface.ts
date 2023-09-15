import type { ColumnType, TablePaginationConfig } from "antd/es/table";
import type {
  ExpandableConfig as TableExpandableConfig,
  TableRowSelection,
} from "antd/es/table/interface.js";
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

interface RowSelectionConfig
  extends Pick<
    TableRowSelection<RecordType>,
    | "columnWidth"
    | "fixed"
    | "hideSelectAll"
    | "preserveSelectedRowKeys"
    | "type"
  > {
  showSelectInfo?: boolean;
}

export type RowSelectionType = boolean | RowSelectionConfig | undefined;

interface ExpandableConfig
  extends Pick<
    TableExpandableConfig<RecordType>,
    | "columnWidth"
    | "expandRowByClick"
    | "defaultExpandAllRows"
    | "fixed"
    | "showExpandColumn"
  > {
  expandIconBrick?: {
    useBrick: UseBrickConf;
  };
  expandedRowBrick?: {
    useBrick: UseBrickConf;
  };
  rowExpandable?: string | boolean;
}

export type ExpandableType = boolean | ExpandableConfig | undefined;
