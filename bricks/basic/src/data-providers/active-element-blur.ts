import { createProviderClass } from "@next-core/utils/general";

export function activeElementBlur(): void {
  // istanbul ignore else
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

customElements.define(
  "basic.active-element-blur",
  createProviderClass(activeElementBlur)
);
