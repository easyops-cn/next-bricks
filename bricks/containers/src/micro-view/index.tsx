import React, { useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./micro-view.shadow.css";
import { wrapBrick } from "@next-core/react-element";
import type {
  EoPageTitle,
  PageTitleProps,
} from "@next-bricks/basic/page-title";
const { defineElement, property } = createDecorators();

const WrappedPageTitle = wrapBrick<EoPageTitle, PageTitleProps>(
  "eo-page-title"
);

interface MicroViewProps {
  pageTitle?: string;
  hasToolbar?: boolean;
  callback: () => () => void;
}

/**
 * 基础页面布局
 * @author sailorshe
 * @category container-layout
 * @deprecated
 */
@defineElement("eo-micro-view", {
  styleTexts: [styleText],
  alias: ["containers.micro-view"],
})
class MicroView extends ReactNextElement {
  /**
   * 页面标题
   */
  @property()
  accessor pageTitle: string | undefined;

  /**
   * 是否有 toolbar 插槽
   * @internal
   */
  @property({ type: Boolean })
  accessor hasToolbar: boolean | undefined;

  #renderCallback = () => {
    const slotToolbar = this.#getSlotBySelector("slot[name='toolbar']");
    const onSlotChange = () => {
      this.hasToolbar = slotToolbar.assignedNodes().length > 0;
    };
    slotToolbar?.addEventListener("slotchange", onSlotChange);

    return () => {
      slotToolbar?.removeEventListener("slotchange", onSlotChange);
    };
  };

  #getSlotBySelector(selector: string): HTMLSlotElement {
    return this.shadowRoot?.querySelector(selector) as HTMLSlotElement;
  }

  render() {
    return (
      <MicroViewElement
        pageTitle={this.pageTitle}
        callback={this.#renderCallback}
      />
    );
  }
}

function MicroViewElement({
  pageTitle,
  callback,
}: MicroViewProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return callback();
  }, [callback]);

  return (
    <div className="micro-view-wrapper" ref={ref}>
      <div className="header">
        {pageTitle && (
          <div className="page-title">
            <WrappedPageTitle pageTitle={pageTitle} />
          </div>
        )}
        <div className="toolbar">
          <slot name="toolbar" />
        </div>
      </div>
      <div className="body">
        <slot />
      </div>
    </div>
  );
}

export { MicroView };
