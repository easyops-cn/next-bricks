import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import { getImageUrl } from "../shared/getImageUrl";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface EoImgIconProps {
  imgSrc?: string;
  imgStyle?: CSSProperties;
  imgLoading?: "lazy" | "eager";
  noPublicRoot?: boolean;
}

export
@defineElement("eo-img-icon", {
  styleTexts: [styleText],
})
class EoImgIcon extends ReactNextElement implements EoImgIconProps {
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

  render() {
    return (
      <EoImgIconComponent
        imgSrc={this.imgSrc}
        imgStyle={this.imgStyle}
        imgLoading={this.imgLoading}
        noPublicRoot={this.noPublicRoot}
      />
    );
  }
}

export function EoImgIconComponent({
  imgSrc,
  imgStyle,
  imgLoading,
  noPublicRoot,
}: EoImgIconProps) {
  const url = getImageUrl(imgSrc, noPublicRoot);

  return url ? <img src={url} style={imgStyle} loading={imgLoading} /> : null;
}

export const WrappedEoImgIcon = wrapLocalBrick<EoImgIcon, EoImgIconProps>(
  EoImgIcon
);
