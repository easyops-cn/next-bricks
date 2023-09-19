/* ============== Common Type Start ============== */

export type Target = "_self" | "_blank" | "_parent" | "_top";

export type UIType = "default" | "dashboard";

export type Shape = "round" | "circle";

/* ============== Common Type Start ============== */

/* ============== Button Type Start ============== */

export type ButtonType =
  | "primary"
  | "default"
  | "dashed"
  | "ghost"
  | "link"
  | "text";

export type ComponentSize = "large" | "medium" | "small" | "xs";

/* ============== Button Type End ============== */

/* ============== Input Type Start ============== */

export type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

/* ============== Input Type End ============== */

/* ============== Input Type Start ============== */

export type Layout = "horizontal" | "vertical" | "inline";

/* ============== Input Type End ============== */

/* ============== Radio Type Start ============== */

export type RadioType =
  | "button"
  | "default"
  | "icon"
  | "icon-circle"
  | "icon-square"
  | "custom";
export interface GeneralComplexOption<T = string | number | boolean> {
  label: string;
  value: T;
  [key: string]: any;
}

export declare type GeneralOption =
  | string
  | number
  | boolean
  | GeneralComplexOption
  | Record<string, any>;

export interface GeneralGroupOption {
  label: string;
  options: GeneralComplexOption | GeneralOption;
}

export declare type RadioGroupButtonStyle = "outline" | "solid";

/* ============== Radio Type End ============== */

/* ============== date Type Start ============== */
export interface DisabledDate {
  second?: string | number;
  minute?: string | number;
  hour?: string | number;
  date?: string | number;
  month?: string | number;
  year?: string | number;
  weekday?: string | number;
}

export type DisabledDateType = DisabledDate | DisabledDate[];
export type PickerMode = "date" | "week" | "month" | "year" | "quarter";
/* ============== date Type End ============== */
