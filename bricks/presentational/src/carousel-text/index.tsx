import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-carousel-text`
 */
export
@defineElement("eo-carousel-text", {
  styleTexts: [styleText],
})
class EoCarouselText extends ReactNextElement {
  /**
   * 展示内容
   */
  @property()
  accessor text: string = "";

  /**
   * 字体大小
   * @default "14px"
   */
  @property()
  accessor fontSize: CSSProperties["fontSize"] = "14px";

  /**
   * 字体颜色
   * @default "black"
   */
  @property()
  accessor fontColor: CSSProperties["color"] = "black";

  /**
   * 动画周期所需时间，单位ms
   * @default 3000
   */
  @property()
  accessor animationDuration: number = 3000;

  render() {
    return (
      <EoCarouselTextComponent
        text={this.text}
        animationDuration={this.animationDuration}
        fontColor={this.fontColor}
        fontSize={this.fontSize}
      />
    );
  }
}

export interface EoCarouselTextProps {
  text: string;
  animationDuration: number;
  fontColor: CSSProperties["color"];
  fontSize: CSSProperties["fontSize"];
}

export function EoCarouselTextComponent(props: EoCarouselTextProps) {
  const { text, animationDuration, fontColor, fontSize } = props;
  return (
    <div className="scrollContainer">
      <div
        className="scrollText"
        style={{
          animationDuration: `${animationDuration}ms`,
          color: fontColor,
          fontSize: fontSize,
        }}
      >
        {text}
      </div>
    </div>
  );
}
