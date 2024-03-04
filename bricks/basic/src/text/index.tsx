import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import classNames from "classnames";

import styleText from "./text.shadow.css";

export type TextType =
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "disabled"
  | "code"
  | "keyboard"
  | undefined;

const typeElementNameMap: Record<string, keyof JSX.IntrinsicElements> = {
  code: "code",
  keyboard: "kbd",
};

export interface TextProps {
  type?: TextType;
  color?: CSSProperties["color"];
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  textAlign?: CSSProperties["textAlign"];
  lineHeight?: CSSProperties["lineHeight"];
  display?: CSSProperties["display"];
  customStyle?: CSSProperties | undefined;
}
const { defineElement, property } = createDecorators();

/**
 * 通用文本构件
 * @author astrid
 *
 * @category text
 */
@defineElement("eo-text", {
  styleTexts: [styleText],
  alias: ["basic.general-text"],
})
class Text extends ReactNextElement implements TextProps {
  /**
   * 文本类型
   * @default -
   */
  @property()
  accessor type: TextType;

  /**
   * 字体大小
   * @default "14px"
   */
  @property()
  accessor fontSize: CSSProperties["fontSize"];

  /**
   * 字体粗细
   * @default "normal"
   */
  @property()
  accessor fontWeight: CSSProperties["fontWeight"];

  /**
   * 字体颜色
   * @default "black"
   */
  @property()
  accessor color: CSSProperties["color"];

  /**
   * 字体行高
   * @default "14px"
   */
  @property()
  accessor lineHeight: CSSProperties["lineHeight"];

  /**
   * 字体对齐方式
   * @default "left"
   */
  @property()
  accessor textAlign: CSSProperties["textAlign"];

  /**
   * 显示类型
   * @default "inline"
   */
  @property()
  accessor display: CSSProperties["display"];

  /**
   * 自定义样式
   */
  @property({ attribute: false }) accessor customStyle:
    | CSSProperties
    | undefined;

  render() {
    return (
      <TextComponent
        type={this.type}
        color={this.color}
        fontSize={this.fontSize}
        fontWeight={this.fontWeight}
        lineHeight={this.lineHeight}
        display={this.display}
        textAlign={this.textAlign}
        customStyle={this.customStyle}
      />
    );
  }
}
export function TextComponent(props: TextProps): React.ReactElement {
  const {
    type,
    color,
    fontSize,
    fontWeight,
    lineHeight,
    display,
    textAlign,
    customStyle,
  } = props;
  const TextElementName: keyof JSX.IntrinsicElements =
    typeElementNameMap[type as string] || "span";

  return (
    <TextElementName
      className={classNames(type)}
      style={
        {
          color: color,
          fontSize: fontSize,
          fontWeight: fontWeight,
          lineHeight: lineHeight,
          display: display,
          textAlign: textAlign,
          ...customStyle,
        } as React.CSSProperties
      }
    >
      <slot />
    </TextElementName>
  );
}
export { Text };
