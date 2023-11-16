import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface DataDisplayFlipperProps {
  flipperTitle?: string;
  data: number | string;
  unit: string;
  flipperStyle?: React.CSSProperties;
  enableTitlePrefix?: boolean;
  showDefaultPrefix?: boolean;
  separator?: string;
}

/**
 * 翻牌器-type-3
 * @author jiezhou
 * @category big-screen-content
 */
@defineElement("data-view.data-display-flipper", {
  styleTexts: [styleText],
})
class DataDisplayFlipper
  extends ReactNextElement
  implements DataDisplayFlipperProps
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

  /**
   * 翻牌器单位
   */
  @property({ attribute: false })
  accessor unit: string;

  /**
   * 是否启用标题前缀插槽
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor enableTitlePrefix: boolean | undefined;

  /**
   * 标题是否展示默认前缀图片
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showDefaultPrefix: boolean | undefined;

  /**
   * 翻牌器数字和单位之间的分隔符
   */
  @property({ attribute: false })
  accessor separator: string;

  render() {
    return (
      <DataDisplayFlipperComponent
        flipperTitle={this.flipperTitle}
        flipperStyle={this.flipperStyle}
        data={this.data}
        unit={this.unit}
        enableTitlePrefix={this.enableTitlePrefix}
        showDefaultPrefix={this.showDefaultPrefix}
        separator={this.separator}
      />
    );
  }
}

export function DataDisplayFlipperComponent(props: DataDisplayFlipperProps) {
  const {
    flipperTitle,
    data,
    unit,
    flipperStyle,
    enableTitlePrefix,
    showDefaultPrefix = true,
    separator,
  } = props;
  return (
    <div className="flipperWrapper" style={{ ...flipperStyle }}>
      <div>
        {
          <div className="prefix">
            {enableTitlePrefix && <slot name="titlePrefix" />}
            {!enableTitlePrefix && showDefaultPrefix && (
              <div className="default-title-prefix" />
            )}
          </div>
        }
      </div>
      <div>
        <div className="title-wrapper">
          <div className="title-content">
            <span className="title">{flipperTitle}</span>
          </div>
        </div>
        <div
          className="data-wrapper"
          style={
            showDefaultPrefix || enableTitlePrefix ? { marginTop: 40 } : {}
          }
        >
          <div className="data-content">
            <div className="data">{data?.toLocaleString()}</div>
            <div className="unit">
              {separator ?? "/"}
              {unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DataDisplayFlipper };
