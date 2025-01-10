import React, { CSSProperties, useCallback, useState, JSX } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { pick } from "lodash";
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

export interface FallbackIcon {
  lib?: "antd" | "easyops" | "fa";
  icon?: string;
  theme?: string;
  category?: string;
  prefix?: string;
  keepSvgOriginalColor?: boolean;
  imgSrc?: string;
  imgStyle?: CSSProperties;
  imgLoading?: "lazy" | "eager";
  noPublicRoot?: boolean;
}

const LIBS = new Set(["antd", "easyops", "fa"]);

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

  /**
   * 设置当图标未找到时的回退图标
   */
  @property({ attribute: false })
  accessor fallback: FallbackIcon | undefined;

  /** 渐变色起始颜色（不适用于 EasyOps 图标） */
  @property() accessor startColor: string | undefined;

  /** 渐变色终止颜色（不适用于 EasyOps 图标） */
  @property() accessor endColor: string | undefined;

  /** 渐变色方向（不适用于 EasyOps 图标） */
  @property() accessor gradientDirection: GradientDirection | undefined;

  /** 是否自动旋转 */
  @property({ type: Boolean, render: false }) accessor spinning:
    | boolean
    | undefined;

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
    return (
      <GeneralIconComponent
        lib={this.lib}
        icon={this.icon}
        theme={this.theme}
        category={this.category}
        prefix={this.prefix}
        fallback={this.fallback}
        startColor={this.startColor}
        endColor={this.endColor}
        gradientDirection={this.gradientDirection}
        imgSrc={this.imgSrc}
        imgStyle={this.imgStyle}
        imgLoading={this.imgLoading}
        noPublicRoot={this.noPublicRoot}
        keepSvgOriginalColor={this.keepSvgOriginalColor}
      />
    );
  }
}

interface GeneralIconComponentProps {
  lib?: "antd" | "easyops" | "fa";
  icon?: string;
  theme?: string;
  category?: string;
  prefix?: string;
  fallback?: FallbackIcon;
  startColor?: string;
  endColor?: string;
  gradientDirection?: GradientDirection;
  keepSvgOriginalColor?: boolean;
  imgSrc?: string;
  imgStyle?: CSSProperties;
  imgLoading?: "lazy" | "eager";
  noPublicRoot?: boolean;
}

function GeneralIconComponent({
  startColor,
  endColor,
  fallback,
  gradientDirection,
  ...props
}: GeneralIconComponentProps): JSX.Element | null {
  const [iconNotFound, setIconNotFound] = useState(
    !(props.imgSrc && typeof props.imgSrc === "string") && !LIBS.has(props.lib!)
  );

  const {
    lib,
    icon,
    theme,
    category,
    prefix,
    keepSvgOriginalColor,
    imgSrc,
    imgStyle,
    imgLoading,
    noPublicRoot,
  } =
    iconNotFound && fallback
      ? {
          ...pick(props, "keepSvgOriginalColor", "imgStyle", "noPublicRoot"),
          ...fallback,
        }
      : props;

  let isImage = imgSrc && typeof imgSrc === "string";
  let mergedImgSrc = imgSrc;
  if (!isImage && lib === "easyops" && category === "image" && icon) {
    isImage = true;
    // For an image icon of EasyOps, such as `ai-robot-png`, use `eo-robot.png` as the file name.
    mergedImgSrc = `${
      // istanbul ignore next
      process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
    }chunks/easyops-icons/${category}/${icon.replace(/-([^-]+)$/, ".$1")}`;
  }

  const handleIconFoundChange = useCallback((e: CustomEvent<boolean>) => {
    setIconNotFound(!e.detail);
  }, []);

  const onIconFoundChange =
    !iconNotFound && fallback ? handleIconFoundChange : undefined;

  if (isImage) {
    return !keepSvgOriginalColor && mergedImgSrc!.endsWith(".svg") ? (
      <WrappedSvgIcon
        imgSrc={mergedImgSrc}
        noPublicRoot={noPublicRoot}
        onIconFoundChange={onIconFoundChange}
      />
    ) : (
      <WrappedEoImgIcon
        imgSrc={mergedImgSrc}
        imgStyle={imgStyle}
        imgLoading={imgLoading}
        noPublicRoot={noPublicRoot}
      />
    );
  }

  const commonProps = {
    icon,
    startColor: startColor,
    endColor: endColor,
    gradientDirection: gradientDirection,
    onIconFoundChange,
  };

  return lib === "antd" ? (
    <WrappedAntdIcon theme={theme} {...commonProps} />
  ) : lib === "easyops" ? (
    // `easyops-icon`s don't support setting gradient color, since we use a
    // single svg path with fill to render the gradient color under the hood,
    // while `easyops-icon`s are using other svg elements.
    <WrappedEasyOpsIcon
      category={category}
      icon={icon}
      onIconFoundChange={onIconFoundChange}
    />
  ) : lib === "fa" ? (
    <WrappedFaIcon prefix={prefix} {...commonProps} />
  ) : null;
}
