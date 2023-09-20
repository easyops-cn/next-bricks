import type { ColumnType, TablePaginationConfig } from "antd/es/table";
import type {
  SortOrder,
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
  /** 记录表格列合并的值的 key */
  cellColSpanKey?: string;
  /** 记录表格行合并的值的 key */
  cellRowSpanKey?: string;
  /** 是否可排序 */
  sortable?: boolean;
  /** 前端搜索时，多列排序优先级 */
  sortMultiple?: number;
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
    | "checkStrictly"
  > {
  showSelectInfo?: boolean;
  rowDisabled?: string | boolean;
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

export interface Sort {
  columnKey?: string | number;
  order?: SortOrder;
}
