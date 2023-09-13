import type { ColumnType } from "antd/es/table";

export type RecordType = Record<string, any>;

export interface Column extends ColumnType<RecordType> {}
