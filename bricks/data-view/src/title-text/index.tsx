import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();
type TitleType = "normal" | "stroke" | "gradient";
interface TitleTextProps {
  text: string;
  type?: TitleType;
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
}

/**
 * @id data-view.title-text
 * @name data-view.title-text
 * @docKind brick
 * @description 大屏标题文本构件
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.title-text", {
  styleTexts: [variablesStyleText, styleText],
})
class TitleText extends ReactNextElement {
  /**
   * @kind TitleType
   * @required  false
   * @default "normal"
   * @description 文本样式，`normal` 纯白， `stroke` 渐变加描边， `gradient` 渐变
   */
  @property({ attribute: false })
  accessor type: TitleType = "normal";

  /**
   * @kind string
   * @required true
   * @default -
   * @description 标题文本
   */
  @property()
  accessor text: string;

  /**
   * @kind  CSSProperties["fontSize"]
   * @required false
   * @default  42px
   * @description 字体大小
   */
  @property()
  accessor fontSize: CSSProperties["fontSize"];

  /**
   * @kind  CSSProperties["fontWeight"]
   * @required false
   * @default   500
   * @description 字体粗细
   */
  @property()
  accessor fontWeight: CSSProperties["fontWeight"];

  /**
   * @kind  CSSProperties["letterSpacing"]
   * @required false
   * @default  17px
   * @description 字体间距
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
            style={{ fontSize, letterSpacing, fontWeight }}
          >
            {text}
          </div>
          <div
            className={`title ${type}-shadow`}
            style={{ fontSize, letterSpacing, fontWeight }}
          >
            {text}
          </div>
        </React.Fragment>
      )}
      <div
        className={`title ${type}-text`}
        style={{ fontSize, letterSpacing, fontWeight }}
      >
        {text}
      </div>
    </div>
  );
}

export { TitleText };
