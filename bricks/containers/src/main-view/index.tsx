import React, { CSSProperties } from "react";
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
  gap?: MainViewGap;
  narrow?: NarrowViewSize;
  bannerOnly?: boolean;
  bannerTitle?: string;
  bannerDescription?: string;
  bannerImage?: string;
  bannerSunk?: boolean;
}

export type MainViewGap = "small" | "medium";

/**
 * 构件 `eo-main-view`
 *
 * @author steve
 *
 * @slot - 内容区
 * @slot breadcrumb - 面包屑
 * @slot pageTitle - 页面标题
 * @slot toolbar - 工具栏
 * @slot banner - Banner 内容
 */
export
@defineElement("eo-main-view", {
  styleTexts: [styleText],
})
class EoMainView extends ReactNextElement {
  /**
   * 标题栏和内容区之间的间隔。
   * 如果内容区已包含一些视觉上的留白，可以设置 `gap: small`。
   *
   * @default "medium"
   */
  @property()
  accessor gap: MainViewGap | undefined;

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
   * 设置仅使用 banner 时，面包屑、标题和工具栏将不会显示。
   */
  @property({ type: Boolean })
  accessor bannerOnly: boolean | undefined;

  @property()
  accessor bannerTitle: string | undefined;

  @property()
  accessor bannerDescription: string | undefined;

  @property()
  accessor bannerImage: string | undefined;

  @property({ type: Boolean })
  accessor bannerSunk: boolean | undefined;

  render() {
    return (
      <EoMainViewComponent
        narrow={this.narrow}
        bannerOnly={this.bannerOnly}
        bannerTitle={this.bannerTitle}
        bannerDescription={this.bannerDescription}
        bannerImage={this.bannerImage}
      />
    );
  }
}

export function EoMainViewComponent({
  narrow: _narrow,
  bannerOnly,
  bannerTitle,
  bannerDescription,
  bannerImage,
}: MainViewProps) {
  const narrow = _narrow ?? "full";
  const bannerConfig = bannerOnly ? { bannerTitle, bannerDescription } : null;

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
      <WrappedNarrowView size={narrow}>
        <div className="content">
          <slot />
        </div>
      </WrappedNarrowView>
    </>
  );
}
