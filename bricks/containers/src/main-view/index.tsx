import React, { useEffect, useRef, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import { getRuntime } from "@next-core/runtime";
import classNames from "classnames";
import "@next-core/theme";
import {
  EoNarrowView,
  NarrowViewProps,
  NarrowViewSize,
} from "../narrow-view/index.js";
import { BannerProps, EoBanner } from "../banner/index.js";
import Logo from "../images/logo.svg";
import { DashboardExit } from "./DashboardExit.js";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

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
  showDashboardLogo?: boolean;
  showDashboardExit?: boolean;
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
  @property({ type: Boolean, render: false })
  accessor noPadding: boolean | undefined;

  /**
   * 是否显示底栏（通常放置按钮）
   * @deprecated 已废弃，请使用 eo-page-view 的 footer
   */
  @property({ type: Boolean })
  accessor showFooter: boolean | undefined;

  /**
   * 是否展示 logo（dashboard 模式）
   * @default true
   */
  @property({ type: Boolean })
  accessor showDashboardLogo: boolean | undefined;

  /**
   * 是否展示退出按钮（dashboard 模式）
   * @default true
   */
  @property({ type: Boolean })
  accessor showDashboardExit: boolean | undefined;

  /**
   * 退出 dashboard 模式
   */
  @event({ type: "dashboard.exit" })
  accessor #dashboardExit!: EventEmitter<void>;

  #handleDashboardExit = () => {
    this.#dashboardExit.emit();
  };

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
        showDashboardLogo={this.showDashboardLogo}
        showDashboardExit={this.showDashboardExit}
        onDashboardExit={this.#handleDashboardExit}
      />
    );
  }
}

interface MainViewComponentProps extends MainViewProps {
  onDashboardExit: () => void;
}

export function EoMainViewComponent({
  narrow: _narrow,
  bannerAlone,
  bannerTitle,
  bannerDescription,
  bannerImage,
  showBanner = true,
  showFooter,
  showDashboardLogo = true,
  showDashboardExit = true,
  onDashboardExit,
}: MainViewComponentProps) {
  const narrow = _narrow ?? "full";
  const bannerConfig = bannerAlone ? { bannerTitle, bannerDescription } : null;
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerPinned, setFooterPinned] = useState(false);

  // Use `documentElement.dataset.mode` instead of `getCurrentMode()` to support
  // legacy v2 runtime.
  const dashboardMode = document.documentElement.dataset.mode === "dashboard";
  const { dashboard_mode_logo_url } = getRuntime().getBrandSettings();

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
          <div className={classNames("titlebar", { dashboard: dashboardMode })}>
            {dashboardMode && showDashboardLogo && (
              <div className="dashboard-logo">
                {dashboard_mode_logo_url ? (
                  <img src={dashboard_mode_logo_url} style={{ height: 32 }} />
                ) : (
                  <Logo />
                )}
              </div>
            )}
            {dashboardMode && <div className="dashboard-title-before" />}
            <div className="page-title">
              <slot name="pageTitle" />
            </div>
            {dashboardMode && <div className="dashboard-title-after" />}
            <div className="toolbar">
              <slot name="toolbar" />
            </div>
            {dashboardMode && showDashboardExit && (
              <DashboardExit onDashboardExit={onDashboardExit} />
            )}
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
