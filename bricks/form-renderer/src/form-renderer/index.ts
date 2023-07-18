import { createDecorators, NextElement } from "@next-core/element";
import { unstable_createRoot } from "@next-core/runtime";

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-form-renderer`
 */
export
@defineElement("eo-form-renderer")
class EoFormRenderer extends NextElement {
  @property({ attribute: false })
  accessor formData: unknown;

  #root: ReturnType<typeof unstable_createRoot> | undefined;

  #createRoot(): void {
    if (this.shadowRoot) {
      return;
    }
    const shadowRoot = this.attachShadow({ mode: "open" });
    this.#root = unstable_createRoot(shadowRoot);
  }

  connectedCallback() {
    super._markConnectedCallbackCalled();
    this.#createRoot();
    this._render();
  }

  disconnectedCallback() {
    this.#root?.render([]);
  }

  protected _render() {
    this.#root?.render({
      brick: "form-renderer.form-renderer",
      properties: {
        formData: this.formData,
      },
    });
  }
}
