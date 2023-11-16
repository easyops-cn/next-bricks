import React from "react";
import { createDecorators } from "@next-core/element";
import {
  ReactNextElement,
  wrapBrick,
  wrapLocalBrick,
} from "@next-core/react-element";
import "@next-core/theme";
import type {
  EoPageTitle,
  PageTitleProps,
} from "@next-bricks/basic/page-title";
import {
  EoNarrowView,
  NarrowViewProps,
  NarrowViewSize,
} from "../narrow-view/index.js";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedPageTitle = wrapBrick<EoPageTitle, PageTitleProps>(
  "eo-page-title"
);
const WrappedNarrowView = wrapLocalBrick<EoNarrowView, NarrowViewProps>(
  EoNarrowView
);

export interface BannerProps {
  bannerTitle?: string;
  bannerDescription?: string;
  narrow?: NarrowViewSize;
}

/**
 * 构件 `eo-banner`
 *
 * @author steve
 *
 * @slot - 内容区
 *
 * @category container-layout
 */
export
@defineElement("eo-banner", {
  styleTexts: [styleText],
})
class EoBanner extends ReactNextElement {
  @property()
  accessor bannerTitle: string | undefined;

  @property()
  accessor bannerDescription: string | undefined;

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

  render() {
    return (
      <EoBannerComponent
        bannerTitle={this.bannerTitle}
        bannerDescription={this.bannerDescription}
        narrow={this.narrow}
      />
    );
  }
}

export function EoBannerComponent({
  bannerTitle,
  bannerDescription,
  narrow: _narrow,
}: BannerProps) {
  const narrow = _narrow ?? "full";
  return (
    <WrappedNarrowView size={narrow}>
      <div className="container">
        {(bannerTitle || bannerDescription) && (
          <div className="title-and-desc">
            {bannerTitle && (
              <WrappedPageTitle
                className="page-title"
                pageTitle={bannerTitle}
              ></WrappedPageTitle>
            )}
            {bannerDescription && (
              <div className="page-desc">{bannerDescription}</div>
            )}
          </div>
        )}
        <div>
          <slot />
        </div>
      </div>
    </WrappedNarrowView>
  );
}
