export interface VisualConfig {
  /** 视觉重量，整型，默认为 0，取值范围 [-1, 2] */
  visualWeight: number;

  /** 显示形式，默认为 text */
  display: "text" | "tag" | "link" | "icon" | "file";

  /** 原始数据类型 */
  type:
    | "integer"
    | "float"
    | "string"
    | "boolean"
    | "enum"
    | "enum-list"
    | "struct"
    | "struct-list"
    // | "array"
    // | "json"
    | "date"
    | "date-time";

  /** 样式设置 */
  style?: VisualStyle;

  /** 根据区间设置不同的样式 */
  ranges?: VisualRange[];

  /** 格式化设置 */
  formatter?: VisualFormatter;

  icon?: string;

  /** 最多显示的列表项数量，当结构体列表数据降级显示时使用 */
  maxItems?: number;

  /** 尽显示列表类数据的数量 */
  countOnly?: number;

  /** 当结构体或结构体列表数据降级显示时，仅显示该字段值 */
  field?: string;
}

export interface VisualStyle {
  /**
   * 尺寸
   *
   * @default "medium"
   */
  size?: "small" | "medium" | "large" | "x-large";

  /**
   * 字重
   *
   * @default "normal"
   */
  fontWeight?: "normal" | "bold";

  /** 内容颜色使用预设的 CSS 变量 */
  color?:
    | "var(--text-color-default)"
    | "var(--text-color-secondary)"
    | "var(--text-color-disabled)"
    | "var(--color-brand)";

  /** 标签变种形式：默认、边框、背景色 */
  variant?: "default" | "outline" | "background";

  /** 背景颜色使用预设的 CSS 变量 */
  background?: VisualBackground;

  /** 背景颜色表 */
  palette?: Record<string, VisualBackground>;
}

export type VisualBackground =
  | "blue"
  | "cyan"
  | "geekblue"
  | "grayblue"
  | "gray"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "yellow"
  | "teal";

export interface VisualRange {
  start?: number;
  end?: number;
  style?: VisualStyle;
}

export type VisualFormatter =
  | DateTimeFormatter
  | CostTimeFormatter
  | NumberFormatter
  | FileFormatter;

export interface DateTimeFormatter {
  type: "date-time" | "date" | "time";

  format?:
    | "full"
    | "default"
    | "accurate"
    | "relative"
    | "future"
    | "auto"
    | string;
}

export interface CostTimeFormatter {
  type: "cost-time";
}

export interface NumberFormatter {
  type: "number";

  format: "decimal" | "currency" | "percent" | "unit";

  /**
   * 货币名，例如 CNY / USD 等
   */
  currency?: string;

  unit?: string;

  /** 保留的小数位数 */
  decimals?: number;

  thousandsSeparator?: boolean;
}

export interface FileFormatter {
  type: "file";

  /** 文件类型，例如 markdown / js / css / php 等 */
  fileType: string;
}
