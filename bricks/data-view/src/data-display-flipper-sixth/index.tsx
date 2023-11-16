import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface DataDisplayFlipperSixthProps {
  flipperTitle?: string;
  data: number | string;
  flipperStyle?: React.CSSProperties;
}

/**
 * 翻牌器-type-6
 * @author jiezhou
 * @category big-screen-content
 */
@defineElement("data-view.data-display-flipper-sixth", {
  styleTexts: [styleText],
})
class DataDisplayFlipperSixth
  extends ReactNextElement
  implements DataDisplayFlipperSixthProps
{
  /** 翻牌器标题 */
  @property() accessor flipperTitle: string;

  /**
   * 翻牌器样式
   * @group other
   */
  @property({ attribute: false }) accessor flipperStyle:
    | React.CSSProperties
    | undefined;

  /**
   * 翻牌器数值
   */
  @property({ attribute: false })
  accessor data: number | string;

  render() {
    return (
      <DataDisplayFlipperSixthComponent
        flipperTitle={this.flipperTitle}
        flipperStyle={this.flipperStyle}
        data={this.data}
      />
    );
  }
}

export function DataDisplayFlipperSixthComponent(
  props: DataDisplayFlipperSixthProps
) {
  const { flipperTitle, data, flipperStyle } = props;
  return (
    <div className="flipperWrapper" style={{ ...flipperStyle }}>
      <div className="title-wrapper">
        <div className="title-content">
          <span className="title">{flipperTitle}</span>
        </div>
      </div>
      <div className="data-wrapper">
        <div className="data-content">
          <div className="data">{data?.toLocaleString()}</div>
        </div>
      </div>
      <div className="flipperBg"></div>
    </div>
  );
}

export { DataDisplayFlipperSixth };
