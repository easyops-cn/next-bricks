import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { isNumber, isNil } from "lodash";

const { defineElement, property } = createDecorators();

/**
 * 构件 `data-view.basic-index-group`
 */
interface BasicIndexGroupProps {
  width?: number;
  gap?: number;
  itemList: ItemProps[];
  layout?: string;
}
export interface ItemProps {
  title: string;
  number: number;
  // 内置四种图标，如果配置了，则imgSrc无效。如果不设置type，则不显示图标，需要配置imgSrc
  type?: "host" | "cloud" | "network" | "database";
  imgSrc?: string;
  description?: string;
  trendIcon?: "up" | "down";
}

/**
 * 基础指标组构件
 * @author annzhang
 */
@defineElement("data-view.basic-index-group", {
  styleTexts: [styleText],
})
class BasicIndexGroup extends ReactNextElement {
  /**
   * 指标组的数据源
   * @required true
   */
  @property({
    attribute: false,
  })
  accessor itemList: ItemProps[];
  /**
   * 容器组宽度
   */
  @property({
    attribute: false,
  })
  accessor width: number;
  /**
   * 指标卡片之间的间距
   * @default 30
   */
  @property({
    attribute: false,
  })
  accessor gap: number;
  /**
   * 布局,左右或上下两种形式
   * @default `left-right`
   */
  @property({
    attribute: false,
  })
  accessor layout: string;
  render() {
    return (
      <BasicIndexGroupComponent
        width={this.width}
        itemList={this.itemList}
        gap={this.gap}
        layout={this.layout}
      />
    );
  }
}

function BasicIndexGroupComponent(props: BasicIndexGroupProps) {
  const { itemList, width, gap, layout } = props;
  const groupStyle = {
    ...(width ? { width: `${width}px` } : {}),
    ...{ gap: gap ? `${gap}px` : "30px" },
  };

  return (
    <div className="groupWrapper" style={groupStyle}>
      {itemList?.map((item: Record<string, any>, index: number) => {
        return (
          <div
            key={index}
            className={`cardWrapper ${
              layout === "top-bottom" ? "topBottomWrapper" : "leftRightWrapper"
            } ${isNil(item.description) ? "thinCard" : ""}`}
          >
            <div
              className={`iconWrapper ${item.type ?? ""}`}
              style={
                item.imgSrc ? { backgroundImage: `url(${item.imgSrc})` } : {}
              }
            ></div>
            <div
              className={`contentWrapper ${
                isNil(item.description) || layout === "top-bottom"
                  ? "noDescription"
                  : "hasDescription"
              }`}
            >
              <div className="titleWrapper">{item.title}</div>
              <div className="numberWrapper">{item.number}</div>
              {!isNil(item.description) && layout !== "top-bottom" && (
                <div className="descriptionWrapper">
                  {!!item.trendIcon && (
                    <span className={`trendIcon ${item.trendIcon}`}></span>
                  )}
                  <span className="descriptionText">{item.description}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export { BasicIndexGroup };
