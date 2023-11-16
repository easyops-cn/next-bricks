import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();
type TitleType = "normal" | "stroke" | "gradient";
export interface TitleTextProps {
  text: string;
  type?: TitleType;
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
}

/**
 * 大屏标题文本构件
 * @author astrid
 * @category big-screen-content
 */
@defineElement("data-view.title-text", {
  styleTexts: [variablesStyleText, styleText],
})
class TitleText extends ReactNextElement implements TitleTextProps {
  /**
   * 文本样式，`normal` 纯白， `stroke` 渐变加描边， `gradient` 渐变
   * @default "normal"
   */
  @property({ attribute: false })
  accessor type: TitleType = "normal";

  /**
   * 标题文本
   * @default -
   */
  @property()
  accessor text: string;

  /**
   * 字体大小
   * @default  42px
   */
  @property()
  accessor fontSize: CSSProperties["fontSize"];

  /**
   * 字体粗细
   * @default   500
   */
  @property()
  accessor fontWeight: CSSProperties["fontWeight"];

  /**
   * 字体间距
   * @default  17px
   */
  @property()
  accessor letterSpacing: CSSProperties["letterSpacing"];

  render() {
    return (
      <TitleTextComponent
        type={this.type}
        text={this.text}
        fontSize={this.fontSize}
        fontWeight={this.fontWeight}
        letterSpacing={this.letterSpacing}
      />
    );
  }
}

export function TitleTextComponent(props: TitleTextProps) {
  const { type, text, letterSpacing, fontSize, fontWeight } = props;
  return (
    <div className="content">
      {type === "stroke" && (
        <React.Fragment>
          <div
            className={`title ${type}-filter`}
            style={{
              fontSize,
              letterSpacing,
              fontWeight,
              lineHeight: fontSize,
            }}
          >
            {text}
          </div>
          <div
            className={`title ${type}-shadow`}
            style={{
              fontSize,
              letterSpacing,
              fontWeight,
              lineHeight: fontSize,
            }}
          >
            {text}
          </div>
        </React.Fragment>
      )}
      <div
        className={`title ${type}-text`}
        style={{ fontSize, letterSpacing, fontWeight, lineHeight: fontSize }}
      >
        {text}
      </div>
    </div>
  );
}

export { TitleText };
