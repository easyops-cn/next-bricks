import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";

export interface TextProps {
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
 * @id basic.general-text
 * @name basic.general-text
 * @docKind brick
 * @description 通用文本构件
 * @author astrid
 * @noInheritDoc
 */
@defineElement("basic.general-text")
class Text extends ReactNextElement implements TextProps {
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
  return (
    <span
      style={
        {
          color: props.color,
          fontSize: props.fontSize,
          fontWeight: props.fontWeight,
          lineHeight: props.lineHeight,
          display: props.display,
          textAlign: props.textAlign,
          ...props.customStyle,
        } as React.CSSProperties
      }
    >
      <slot />
    </span>
  );
}
export { Text };
