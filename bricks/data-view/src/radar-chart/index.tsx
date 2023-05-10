import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";

import styleText from "./styles.shadow.css";
import {
  Data,
  DataCircle,
  DataFill,
  DataLine,
  RadarProps,
} from "./interface.js";
import { Radar } from "./radar.js";

const { defineElement, property } = createDecorators();

/**
 * @id data-view.radar-chart
 * @name data-view.radar-chart
 * @docKind brick
 * @description 雷达图
 * @author zekunpan
 * @noInheritDoc
 */
@defineElement("data-view.radar-chart", {
  styleTexts: [styleText],
})
class RadarChart extends ReactNextElement implements RadarProps {
  /**
   * @default
   * @required
   * @description 数据
   */
  @property({
    attribute: false,
  })
  accessor dataSource: Data[];

  /**
   * @default
   * @required
   * @description 容器宽度
   */
  @property({
    attribute: false,
  })
  accessor width: number;

  /**
   * @default
   * @required
   * @description 多边形半径
   */
  @property({
    attribute: false,
  })
  accessor radius: number;

  /**
   * @default
   * @required
   * @description 容器高度
   */
  @property({
    attribute: false,
  })
  accessor height: number;

  /**
   * @default
   * @required
   * @description 中心评分
   */
  @property({
    attribute: false,
  })
  accessor value: number | string;

  /**
   * @default
   * @required
   * @description 数据多边形填充样式
   */
  @property({
    attribute: false,
  })
  accessor dataFill: DataFill;

  /**
   * @default
   * @required
   * @description 数据点圆圈的样式配置
   */
  @property({
    attribute: false,
  })
  accessor dataCircle: DataCircle;

  /**
   * @default
   * @required
   * @description 数据线条的样式配置
   */
  @property({
    attribute: false,
  })
  accessor dataLine: DataLine;

  render() {
    return (
      <Radar
        dataSource={this.dataSource}
        width={this.width}
        height={this.height}
        radius={this.radius}
        value={this.value}
        dataFill={this.dataFill}
        dataCircle={this.dataCircle}
        dataLine={this.dataLine}
      />
    );
  }
}
export { RadarChart };
