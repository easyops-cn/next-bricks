import {
  NextElement,
  createDecorators,
  supportsAdoptingStyleSheets,
  type EventEmitter,
} from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import { getIcon } from "../shared/SvgCache.js";
import type { IconEvents, IconEventsMapping } from "../shared/interfaces.js";
import sharedStyleText from "../shared/icons.shadow.css";
import type { EoImgIcon } from "../img-icon/index.jsx";

const { defineElement, property, event } = createDecorators();

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
    const category = _category || "default";
    const url = icon
      ? `${
          // istanbul ignore next
          process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
        }chunks/easyops-icons/${category}/${category === "image" ? icon.replace(/-([^-]+)$/, ".$1") : `${icon}.svg`}`
      : undefined;
    let iconFound: boolean;
    if (category === "image") {
      const imgIcon = document.createElement("eo-img-icon") as EoImgIcon;
      imgIcon.imgSrc = url;
      this.shadowRoot.replaceChildren(imgIcon);
      iconFound = true;
    } else {
      const svg = await getIcon(url, {
        currentColor: !category.startsWith("colored-"),
      });
      if (category !== (this.category ?? "default") || icon !== this.icon) {
        // The icon has changed during `await getIcon(...)`
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

      iconFound = !!svg;
    }

    if (this.#iconFound !== iconFound) {
      this.#iconFoundEvent.emit((this.#iconFound = iconFound));
    }
  }
}

export const WrappedEasyOpsIcon = wrapLocalBrick<
  EasyOpsIcon,
  EasyOpsIconProps,
  IconEvents,
  IconEventsMapping
>(EasyOpsIcon, { onIconFoundChange: "icon.found" });
