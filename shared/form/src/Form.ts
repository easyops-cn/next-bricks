import type { FormStore } from "./FormStore.js";
export type ColSpanType = number | string;

export interface ColSize {
  span?: ColSpanType;
  offset?: ColSpanType;
}

export interface ColProps {
  span?: ColSpanType;
  offset?: ColSpanType;
  sm?: ColSpanType | ColSize;
  md?: ColSpanType | ColSize;
  lg?: ColSpanType | ColSize;
  xl?: ColSpanType | ColSize;
  xxl?: ColSpanType | ColSize;
}

export interface AbstractForm extends HTMLElement {
  readonly isFormElement: true;
  formStore: FormStore;
  size?: "large" | "medium" | "small" | "xs";
  layout?: "horizontal" | "vertical" | "inline";
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  validate(): boolean | Record<string, unknown>;
  validateField(name: string): void;
  resetValidateState(): void;
}
