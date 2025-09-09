import {
  NextElement,
  createDecorators,
  supportsAdoptingStyleSheets,
  type EventEmitter,
} from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import {
  DefineLinearGradientProps,
  GradientDirection,
} from "../shared/DefineLinearGradient.js";
import lucideStyleText from "./styles.shadow.css";
import sharedStyleText from "../shared/icons.shadow.css";
import type { IconEvents, IconEventsMapping } from "../shared/interfaces.js";
import { getIcon } from "../shared/SvgCache.js";

const { defineElement, property, event } = createDecorators();

export interface LucideIconProps extends DefineLinearGradientProps {
  icon?: string;
  strokeWidth?: number;
}

const styleText = [lucideStyleText, sharedStyleText].join("\n");

export
@defineElement("eo-lucide-icon")
class LucideIcon extends NextElement implements LucideIconProps {
  /** 图标名 */
  @property() accessor icon: string | undefined;

  /**
   * 描线粗线，限制在区间 `[0.5, 3]`
   * @default 2
   */
  @property({ type: Number }) accessor strokeWidth: number | undefined;

  /** 渐变色起始颜色 */
  @property() accessor startColor: string | undefined;

  /** 渐变色终止颜色 */
  @property() accessor endColor: string | undefined;

  /** 渐变色方向 */
  @property() accessor gradientDirection: GradientDirection | undefined;

  @event({ type: "icon.found" })
  accessor #iconFoundEvent!: EventEmitter<boolean>;

  #iconFound = true;

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
    const { icon } = this;
    const url = icon
      ? `${
          // istanbul ignore next
          process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
        }chunks/lucide-icons/${icon}.svg`
      : undefined;
    const svg = await getIcon(url);
    if (icon !== this.icon) {
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
        const coords =
          this.gradientDirection === "left-to-right"
            ? 'x1="0" y1="0" x2="100%" y2="0"'
            : 'x1="0" y1="0" x2="0" y2="100%"';
        const defs = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "defs"
        );
        defs.innerHTML = `<linearGradient gradientUnits="userSpaceOnUse" id="linear-gradient" ${coords}><stop offset="0%" stop-color="${escapeAttr(
          this.startColor
        )}"></stop><stop offset="100%" stop-color="${escapeAttr(
          this.endColor
        )}"></stop></linearGradient>`;
        svg.insertBefore(defs, svg.firstChild);
      }

      const strokeWidth = this.strokeWidth ?? 2;
      if (strokeWidth !== 2) {
        svg.setAttribute(
          "stroke-width",
          String(Math.max(0.5, Math.min(3, strokeWidth)))
        );
      }
    }

    this.shadowRoot.replaceChildren(...nodes);

    const iconFound = !!svg;
    if (this.#iconFound !== iconFound) {
      this.#iconFoundEvent.emit((this.#iconFound = iconFound));
    }
  }
}

function escapeAttr(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const WrappedLucideIcon = wrapLocalBrick<
  LucideIcon,
  LucideIconProps,
  IconEvents,
  IconEventsMapping
>(LucideIcon, { onIconFoundChange: "icon.found" });
