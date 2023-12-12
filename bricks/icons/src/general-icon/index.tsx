import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { AntdIconProps, WrappedAntdIcon } from "../antd-icon/index.js";
import { EasyOpsIconProps, WrappedEasyOpsIcon } from "../easyops-icon/index.js";
import { FaIconProps, WrappedFaIcon } from "../fa-icon/index.js";
import { EoImgIconProps, WrappedEoImgIcon } from "../img-icon/index.js";
import { WrappedSvgIcon } from "../svg-icon/index.js";
import type {
  DefineLinearGradientProps,
  GradientDirection,
} from "../shared/DefineLinearGradient.js";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface GeneralIconPropsOfAntd
  extends AntdIconProps,
    GeneralIconBaseProps {
  lib: "antd";
}

export interface GeneralIconPropsOfEasyOps
  extends EasyOpsIconProps,
    GeneralIconBaseProps {
  lib: "easyops";
}

export interface GeneralIconPropsOfFa
  extends FaIconProps,
    GeneralIconBaseProps {
  lib: "fa";
}

export interface ImgIconProps extends EoImgIconProps, GeneralIconBaseProps {}

export interface GeneralIconBaseProps {
  spinning?: boolean;
  keepSvgOriginalColor?: boolean;
}

export type LibIconProps =
  | GeneralIconPropsOfAntd
  | GeneralIconPropsOfEasyOps
  | GeneralIconPropsOfFa;

export type GeneralIconProps = LibIconProps | ImgIconProps;

/**
 * 通用图标构件
 *
 * @category display-component
 */
export
@defineElement("eo-icon", {
  styleTexts: [styleText],
  alias: ["icons.general-icon"],
})
class GeneralIcon
  extends ReactNextElement
  implements DefineLinearGradientProps
{
  /** 图标库 */
  @property() accessor lib: "antd" | "easyops" | "fa" | undefined;

  /**
   * Ant Design 图标主题
   * @default "outlined"
   */
  @property() accessor theme: string | undefined;

  /** 图标名 */
  @property() accessor icon: string | undefined;

  /**
   * EasyOps 图标分类
   * @default "default"
   */
  @property() accessor category: string | undefined;

  // Note: `prefix` is a native prop on Element, but it's only used in XML documents.
  /**
   * FontAwesome 图标前缀
   * @default "fas"
   */
  @property() accessor prefix!: string;

  /** 渐变色起始颜色（不适用于 EasyOps 图标） */
  @property() accessor startColor: string | undefined;

  /** 渐变色终止颜色（不适用于 EasyOps 图标） */
  @property() accessor endColor: string | undefined;

  /** 渐变色方向（不适用于 EasyOps 图标） */
  @property() accessor gradientDirection: GradientDirection | undefined;

  /** 是否自动旋转 */
  @property({ type: Boolean }) accessor spinning: boolean | undefined;

  /** 图片地址 */
  @property() accessor imgSrc: string | undefined;

  /** 图片样式 */
  @property({
    attribute: false,
  })
  accessor imgStyle: CSSProperties | undefined;

  /** 加载方式 */
  @property() accessor imgLoading: "lazy" | "eager" | undefined;

  @property({
    type: Boolean,
  })
  accessor noPublicRoot: boolean | undefined;

  /** 如果是 svg 图片，默认将转换该图标颜色为自动跟随文本色，设置 `keepSvgOriginalColor: true` 可保留原始颜色 */
  @property({
    type: Boolean,
  })
  accessor keepSvgOriginalColor: boolean | undefined;

  render() {
    if (this.imgSrc && typeof this.imgSrc === "string") {
      return !this.keepSvgOriginalColor && this.imgSrc.endsWith(".svg") ? (
        <WrappedSvgIcon imgSrc={this.imgSrc} noPublicRoot={this.noPublicRoot} />
      ) : (
        <WrappedEoImgIcon
          imgSrc={this.imgSrc}
          imgStyle={this.imgStyle}
          imgLoading={this.imgLoading}
          noPublicRoot={this.noPublicRoot}
        />
      );
    }

    const commonProps = {
      icon: this.icon,
      startColor: this.startColor,
      endColor: this.endColor,
      gradientDirection: this.gradientDirection,
    };
    return this.lib === "antd" ? (
      <WrappedAntdIcon theme={this.theme} {...commonProps} />
    ) : this.lib === "easyops" ? (
      // `easyops-icon`s don't support setting gradient color, since we use a
      // single svg path with fill to render the gradient color under the hood,
      // while `easyops-icon`s are using other svg elements.
      <WrappedEasyOpsIcon category={this.category} icon={this.icon} />
    ) : this.lib === "fa" ? (
      <WrappedFaIcon prefix={this.prefix} {...commonProps} />
    ) : null;
  }
}
