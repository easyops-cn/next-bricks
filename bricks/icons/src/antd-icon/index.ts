import {
  NextElement,
  createDecorators,
  supportsAdoptingStyleSheets,
} from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import {
  DefineLinearGradientProps,
  GradientDirection,
} from "../shared/DefineLinearGradient.js";
import linearGradientStyleText from "../shared/DefineLinearGradient.shadow.css";
import { getIcon } from "../shared/SvgCache.js";

const { defineElement, property } = createDecorators();

export interface AntdIconProps extends DefineLinearGradientProps {
  /** Defaults to "outlined" */
  theme?: string;
  icon?: string;
}

const styleText = linearGradientStyleText;

export
@defineElement("icons.antd-icon")
class AntdIcon extends NextElement implements AntdIconProps {
  @property() accessor theme: string | undefined;
  @property() accessor icon: string | undefined;
  @property() accessor startColor: string | undefined;
  @property() accessor endColor: string | undefined;
  @property() accessor gradientDirection: GradientDirection | undefined;

  #createShadowRoot(): void {
    if (this.shadowRoot) {
      return;
    }
    const shadowRoot = this.attachShadow({ mode: "open" });
    // istanbul ignore next: browser only
    if (supportsAdoptingStyleSheets()) {
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(styleText);
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
    const { theme: _theme, icon } = this;
    const theme = _theme ?? "outlined";
    const url = icon
      ? `${
          // istanbul ignore next
          process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
        }chunks/antd-icons/${theme}/${icon}.svg`
      : undefined;
    const svg = await getIcon(url, { currentColor: theme !== "twotone" });
    if (theme !== (this.theme ?? "outlined") || icon !== this.icon) {
      // The icon has changed
      return;
    }
    // Currently React can't render mixed React Component and DOM nodes which are siblings,
    // so we manually construct the DOM.
    const nodes: Node[] = [];
    // istanbul ignore next: browser only
    if (!supportsAdoptingStyleSheets()) {
      const style = document.createElement("style");
      style.textContent = styleText;
      nodes.push(style);
    }
    if (svg) {
      nodes.push(svg);
      if (this.startColor && this.endColor) {
        const gradients = document.createElement("div");
        gradients.className = "gradients";
        const coords =
          this.gradientDirection === "left-to-right"
            ? 'x1="0" y1="0" x2="1" y2="0"'
            : 'x1="0" y1="0" x2="0" y2="1"';
        gradients.innerHTML = `<svg width="0" height="0" aria-hidden="true" focusable="false"><defs><linearGradient id="linear-gradient" ${coords}><stop offset="0%" stop-color="${escapeAttr(
          this.startColor
        )}"></stop><stop offset="100%" stop-color="${escapeAttr(
          this.endColor
        )}"></stop></linearGradient></defs></svg>`;
        nodes.push(gradients);
      }
    }

    this.shadowRoot.replaceChildren(...nodes);
  }
}

function escapeAttr(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const WrappedAntdIcon = wrapLocalBrick<AntdIcon, AntdIconProps>(
  AntdIcon
);
