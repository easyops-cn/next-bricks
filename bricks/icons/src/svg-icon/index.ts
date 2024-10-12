import {
  NextElement,
  createDecorators,
  supportsAdoptingStyleSheets,
  type EventEmitter,
} from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import { constructSvgElement, getIcon } from "../shared/SvgCache.js";
import { getImageUrl } from "../shared/getImageUrl.js";
import type { IconEvents, IconEventsMapping } from "../shared/interfaces.js";
import sharedStyleText from "../shared/icons.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface SvgIconProps {
  imgSrc?: string;
  svgContent?: string;
  noPublicRoot?: boolean;
}

export
@defineElement("eo-svg-icon", {})
class SvgIcon extends NextElement implements SvgIconProps {
  /** 图标地址 */
  @property() accessor imgSrc: string | undefined;

  @property() accessor svgContent: string | undefined;

  @property({
    type: Boolean,
  })
  accessor noPublicRoot: boolean | undefined;

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
    let svg: SVGElement | null = null;
    if (this.svgContent) {
      svg = constructSvgElement(this.svgContent, false, { currentColor: true });
    } else {
      const url = getImageUrl(this.imgSrc, this.noPublicRoot);
      svg = await getIcon(url, { currentColor: true });
      if (url !== getImageUrl(this.imgSrc, this.noPublicRoot)) {
        // The icon has changed during `await getIcon(...)`
        return;
      }
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

    const iconFound = !!svg;
    if (this.#iconFound !== iconFound) {
      this.#iconFoundEvent.emit((this.#iconFound = iconFound));
    }
  }
}

export const WrappedSvgIcon = wrapLocalBrick<
  SvgIcon,
  SvgIconProps,
  IconEvents,
  IconEventsMapping
>(SvgIcon, { onIconFoundChange: "icon.found" });
