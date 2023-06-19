import type { FormStore } from "./FormStore.js";

export interface AbstractForm extends HTMLElement {
  readonly isFormElement: true;
  formStore: FormStore;
  size?: "large" | "medium" | "small" | "xs";
  layout?: "horizontal" | "vertical" | "inline";
  validate(): boolean | Record<string, unknown>;
  validateField(name: string): void;
  resetValidateState(): void;
}
