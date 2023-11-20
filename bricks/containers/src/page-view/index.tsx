import React, { useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import {
  EoNarrowView,
  NarrowViewProps,
  NarrowViewSize,
} from "../narrow-view/index.js";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedNarrowView = wrapLocalBrick<EoNarrowView, NarrowViewProps>(
  EoNarrowView
);

export interface PageViewProps {
  narrow?: NarrowViewSize;
  showFooter?: boolean;
  fixedFooter?: boolean;
}

/**
 * 页面视图
 *
 * @author steve
 *
 * @slot - 内容区
 * @slot header - 顶栏
 * @slot sidebar - 侧边栏
 * @slot subSidebar - 子侧边栏
 * @slot footer - 底栏（通常放置按钮）
 *
 * @category container-layout
 */
export
@defineElement("eo-page-view", {
  styleTexts: [styleText],
})
class EoPageView extends ReactNextElement {
  /**
   * 设置窄布局模式（居中）。
   *
   * - "full": 全尺寸（非窄布局居中）
   * - "small": 小尺寸窄布局
   * - "medium": 中等尺寸窄布局
   * - "large": 大尺寸窄布局
   *
   * @default "full"
   */
  @property()
  accessor narrow: NarrowViewSize | undefined;

  /**
   * 是否显示底栏（通常放置按钮）
   */
  @property({ type: Boolean })
  accessor showFooter: boolean | undefined;

  /**
   * 底栏始终固定在底部。
   * 未设置时 footer 默认为 sticky，即：屏幕高度足够时，底栏跟随内容区上移而不是始终固定。
   */
  @property({ type: Boolean })
  accessor fixedFooter: boolean | undefined;

  render() {
    return (
      <EoPageViewComponent
        narrow={this.narrow}
        showFooter={this.showFooter}
        fixedFooter={this.fixedFooter}
      />
    );
  }
}

export function EoPageViewComponent({
  narrow: _narrow,
  showFooter,
  fixedFooter,
}: PageViewProps) {
  const narrow = _narrow ?? "full";
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerPinned, setFooterPinned] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (showFooter && !fixedFooter && footer) {
      const observer = new IntersectionObserver(
        ([e]) => {
          setFooterPinned(e.intersectionRatio < 1);
        },
        {
          rootMargin: "0px 0px -1px 0px",
          threshold: [1],
        }
      );
      observer.observe(footer);
      return () => {
        observer.disconnect();
      };
    }
  }, [showFooter, fixedFooter]);

  return (
    <>
      <div className="header">
        <slot name="header" />
      </div>
      <div className="main">
        <div className="sidebar">
          <slot name="sidebar" />
        </div>
        <div className="sub-sidebar">
          <slot name="subSidebar" />
        </div>
        <div className="content">
          <slot />
          <div
            className={classNames("footer", { pinned: footerPinned })}
            ref={footerRef}
          >
            <WrappedNarrowView size={narrow}>
              <slot name="footer" />
            </WrappedNarrowView>
          </div>
        </div>
      </div>
    </>
  );
}
