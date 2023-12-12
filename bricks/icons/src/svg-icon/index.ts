import {
  NextElement,
  createDecorators,
  supportsAdoptingStyleSheets,
} from "@next-core/element";
import { wrapLocalBrick } from "@next-core/react-element";
import { getIcon } from "../shared/SvgCache.js";
import { getImageUrl } from "../shared/getImageUrl.js";
import sharedStyleText from "../shared/icons.shadow.css";

const { defineElement, property } = createDecorators();

export interface SvgIconProps {
  imgSrc?: string;
  noPublicRoot?: boolean;
}

export
@defineElement("eo-svg-icon", {})
class SvgIcon extends NextElement implements SvgIconProps {
  /** 图标地址 */
  @property() accessor imgSrc: string | undefined;

  @property({
    type: Boolean,
  })
  accessor noPublicRoot: boolean | undefined;

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
    const url = getImageUrl(this.imgSrc, this.noPublicRoot);

    const svg = await getIcon(url, { currentColor: true });
    if (url !== getImageUrl(this.imgSrc, this.noPublicRoot)) {
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
  }
}

export const WrappedSvgIcon = wrapLocalBrick<SvgIcon, SvgIconProps>(SvgIcon);
