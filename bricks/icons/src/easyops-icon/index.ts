import { NextElement, createDecorators } from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import { getIcon } from "../shared/SvgCache.js";

const { defineElement, property } = createDecorators();

export interface EasyOpsIconProps {
  /** Defaults to "default" */
  category?: string;
  icon?: string;
}

@defineElement("icons.easyops-icon")
class EasyOpsIcon extends NextElement implements EasyOpsIconProps {
  @property() accessor category: string | undefined;
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

  protected async _render() {
    if (!this.isConnected || !this.shadowRoot) {
      return;
    }
    const { category, icon } = this;
    const url = icon
      ? `${__webpack_public_path__}chunks/easyops-icons/${
          category ?? "default"
        }/${icon}.svg`
      : undefined;
    const svg = await getIcon(url, {
      currentColor: !category?.startsWith("colored-"),
    });
    if (category !== this.category || icon !== this.icon) {
      // The icon has changed
      return;
    }
    this.shadowRoot.replaceChildren(...([svg].filter(Boolean) as Node[]));
  }
}

export const WrappedEasyOpsIcon = wrapLocalBrick<EasyOpsIcon, EasyOpsIconProps>(
  EasyOpsIcon
);

// Prettier reports error if place `export` before decorators.
// https://github.com/prettier/prettier/issues/14240
export { EasyOpsIcon };
