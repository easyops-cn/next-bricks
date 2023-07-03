import {
  NextElement,
  createDecorators,
  supportsAdoptingStyleSheets,
} from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import { getIcon } from "../shared/SvgCache.js";
import sharedStyleText from "../shared/icons.shadow.css";

const { defineElement, property } = createDecorators();

export interface EasyOpsIconProps {
  /** Defaults to "default" */
  category?: string;
  icon?: string;
}

export
@defineElement("eo-easyops-icon", {
  alias: ["icons.easyops-icon"],
})
class EasyOpsIcon extends NextElement implements EasyOpsIconProps {
  /**
   * 图标分类
   * @default "default"
   */
  @property() accessor category: string | undefined;

  /** 图标名 */
  @property() accessor icon: string | undefined;

  #createShadowRoot(): void {
    if (this.shadowRoot) {
      return;
    }
    const shadowRoot = this.attachShadow({ mode: "open" });
    // istanbul ignore next: browser only
    if (supportsAdoptingStyleSheets()) {
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(sharedStyleText);
      shadowRoot.adoptedStyleSheets = [styleSheet];
    }
  }

  connectedCallback() {
    super._markConnectedCallbackCalled();
    this.#createShadowRoot();
    this._render();
  }

  disconnectedCallback() {
    this.shadowRoot?.replaceChildren();
  }

  protected async _render() {
    if (!this.isConnected || !this.shadowRoot) {
      return;
    }
    const { category: _category, icon } = this;
    const category = _category ?? "default";
    const url = icon
      ? `${
          // istanbul ignore next
          process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
        }chunks/easyops-icons/${category}/${icon}.svg`
      : undefined;
    const svg = await getIcon(url, {
      currentColor: !category.startsWith("colored-"),
    });
    if (category !== (this.category ?? "default") || icon !== this.icon) {
      // The icon has changed
      return;
    }
    // Currently React can't render mixed React Component and DOM nodes which are siblings,
    // so we manually construct the DOM.
    const nodes: Node[] = [];
    // istanbul ignore next: browser only
    if (!supportsAdoptingStyleSheets()) {
      const style = document.createElement("style");
      style.textContent = sharedStyleText;
      nodes.push(style);
    }
    if (svg) {
      nodes.push(svg);
    }
    this.shadowRoot.replaceChildren(...nodes);
  }
}

export const WrappedEasyOpsIcon = wrapLocalBrick<EasyOpsIcon, EasyOpsIconProps>(
  EasyOpsIcon
);
