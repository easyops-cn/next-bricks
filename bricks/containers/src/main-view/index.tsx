import React from "react";
import { createDecorators } from "@next-core/element";
import {
  ReactNextElement,
  wrapBrick,
  wrapLocalBrick,
} from "@next-core/react-element";
import "@next-core/theme";
import type {
  EoNarrowView,
  NarrowViewProps,
  NarrowViewSize,
} from "../narrow-view/index.js";
import { BannerProps, EoBanner } from "../banner/index.js";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedNarrowView = wrapBrick<EoNarrowView, NarrowViewProps>(
  "eo-narrow-view"
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
 * @slot footer - 底栏（通常放置按钮）
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
   * 是否显示底栏（通常放置按钮）
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
}: MainViewProps) {
  const narrow = _narrow ?? "full";
  const bannerConfig = bannerAlone ? { bannerTitle, bannerDescription } : null;

  return (
    <>
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
      <WrappedNarrowView className="content" size={narrow}>
        <slot />
      </WrappedNarrowView>
      <div className="footer">
        <WrappedNarrowView size={narrow}>
          <slot name="footer" />
        </WrappedNarrowView>
      </div>
    </>
  );
}
