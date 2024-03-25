import React, { useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import "@next-core/theme";
import {
  EoNarrowView,
  NarrowViewProps,
  NarrowViewSize,
} from "../narrow-view/index.js";
import { BannerProps, EoBanner } from "../banner/index.js";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrappedNarrowView = wrapLocalBrick<EoNarrowView, NarrowViewProps>(
  EoNarrowView
);
const WrappedBanner = wrapLocalBrick<EoBanner, BannerProps>(EoBanner);

export interface MainViewProps {
  contentGap?: MainViewGap;
  narrow?: NarrowViewSize;
  bannerAlone?: boolean;
  bannerTitle?: string;
  bannerDescription?: string;
  bannerImage?: string;
  bannerSunk?: boolean;
  showBanner?: boolean;
  showFooter?: boolean;
}

export type MainViewGap = "small" | "medium";

/**
 * 主内容视图
 *
 * @author steve
 *
 * @slot - 内容区
 * @slot breadcrumb - 面包屑
 * @slot pageTitle - 页面标题
 * @slot toolbar - 工具栏
 * @slot banner - Banner 内容
 * @slot footer - 底栏（通常放置按钮），已废弃，请使用 eo-page-view 的 footer
 * @category container-layout
 */
export
@defineElement("eo-main-view", {
  styleTexts: [styleText],
})
class EoMainView extends ReactNextElement {
  /**
   * 标题栏和内容区之间的间隔。
   * 如果内容区已包含一些视觉上的留白，可以设置 `contentGap: small`。
   *
   * @default "medium"
   */
  @property()
  accessor contentGap: MainViewGap | undefined;

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
   * 设置是否铺满容器。
   */
  @property({ type: Boolean })
  accessor fillContainer: boolean | undefined;

  /**
   * 设置仅使用 banner 时，面包屑、标题和工具栏将不会显示。
   */
  @property({ type: Boolean })
  accessor bannerAlone: boolean | undefined;

  @property()
  accessor bannerTitle: string | undefined;

  @property()
  accessor bannerDescription: string | undefined;

  @property()
  accessor bannerImage: string | undefined;

  @property({ type: Boolean })
  accessor bannerSunk: boolean | undefined;

  /**
   * 是否展示 banner（包括页面标题，面包屑，工作栏）
   * @default true
   */
  @property({ type: Boolean })
  accessor showBanner: boolean | undefined;

  /**
   * 是否没有边距
   */
  @property({ type: Boolean })
  accessor noPadding: boolean | undefined;

  /**
   * 是否显示底栏（通常放置按钮）
   * @deprecated 已废弃，请使用 eo-page-view 的 footer
   */
  @property({ type: Boolean })
  accessor showFooter: boolean | undefined;

  render() {
    return (
      <EoMainViewComponent
        narrow={this.narrow}
        bannerAlone={this.bannerAlone}
        bannerTitle={this.bannerTitle}
        bannerDescription={this.bannerDescription}
        bannerImage={this.bannerImage}
        showBanner={this.showBanner}
        showFooter={this.showFooter}
      />
    );
  }
}

export function EoMainViewComponent({
  narrow: _narrow,
  bannerAlone,
  bannerTitle,
  bannerDescription,
  bannerImage,
  showBanner = true,
  showFooter,
}: MainViewProps) {
  const narrow = _narrow ?? "full";
  const bannerConfig = bannerAlone ? { bannerTitle, bannerDescription } : null;
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerPinned, setFooterPinned] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (showFooter && footer) {
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
  }, [showFooter]);

  return (
    <>
      {showBanner && (
        <WrappedBanner
          narrow={narrow}
          style={{
            backgroundImage: bannerImage,
          }}
          {...bannerConfig}
        >
          <div className="breadcrumb">
            <slot name="breadcrumb" />
          </div>
          <div className="titlebar">
            <div className="page-title">
              <slot name="pageTitle" />
            </div>
            <div className="toolbar">
              <slot name="toolbar" />
            </div>
          </div>
          <div className="banner">
            <slot name="banner" />
          </div>
        </WrappedBanner>
      )}
      <WrappedNarrowView className="content" size={narrow}>
        <slot />
      </WrappedNarrowView>
      <div
        className={classNames("footer", { pinned: footerPinned })}
        ref={footerRef}
      >
        <WrappedNarrowView size={narrow}>
          <slot name="footer" />
        </WrappedNarrowView>
      </div>
    </>
  );
}
