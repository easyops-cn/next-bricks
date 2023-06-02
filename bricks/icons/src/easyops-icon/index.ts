import { NextElement, createDecorators } from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import { getIcon } from "../shared/SvgCache.js";

const { defineElement, property } = createDecorators();

export interface EasyOpsIconProps {
  /** Defaults to "default" */
  category?: string;
  icon?: string;
}

export
@defineElement("icons.easyops-icon")
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
    this.attachShadow({ mode: "open" });
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
    this.shadowRoot.replaceChildren(...([svg].filter(Boolean) as Node[]));
  }
}

export const WrappedEasyOpsIcon = wrapLocalBrick<EasyOpsIcon, EasyOpsIconProps>(
  EasyOpsIcon
);
