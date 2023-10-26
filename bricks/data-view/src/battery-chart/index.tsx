import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./battery-chart.shadow.css";
const { defineElement, property } = createDecorators();
interface ThresholdColor {
  color: React.CSSProperties["color"];
  startValue: number;
  endValue: number;
  /** 电池头的颜色，默认取 color，color为渐变色，需要单独配置头部颜色，请使用该属性 */
  headerColor?: React.CSSProperties["color"];
}
interface BatteryChartChartProps {
  value: number;
  thresholdColors?: ThresholdColor[];
  thresholdValue?: number;
  batteryWidth?: number;
  batteryHeight?: number;
}
/**
 * 大屏电池
 * @author astrid
 */
@defineElement("data-view.battery-chart", {
  styleTexts: [variablesStyleText, styleText],
})
class BatteryChart extends ReactNextElement implements BatteryChartChartProps {
  /**
   * @kind number
   * @default -
   * @required false
   * @description 值, 默认范围在[0-100], 但是范围还可通过 thresholdColors 来改变，将取第一个和最后一个值作为范围
   */
  @property({ type: Number })
  accessor value: number;

  /**
   * @kind  number
   * @default  38
   * @required false
   * @description 电池的宽度
   */
  @property({ type: Number })
  accessor batteryWidth: number;

  /**
   * @kind  number
   * @default  58
   * @required false
   * @description 电池的高度
   */
  @property({ type: Number })
  accessor batteryHeight: number;

  /**
   * @kind  ThresholdColor[]
   * @default  -
   * @required false
   * @description 阈值范围以及颜色的配置；
   */
  @property({ attribute: false })
  accessor thresholdColors: ThresholdColor[];

  /**
   * @kind  number
   * @default  50
   * @required false
   * @description 阈值刻度线
   */
  @property({ type: Number })
  accessor thresholdValue: number;

  render(): React.ReactNode {
    return (
      <BatteryChartComponent
        value={this.value}
        thresholdValue={this.thresholdValue}
        thresholdColors={this.thresholdColors}
        batteryHeight={this.batteryHeight}
        batteryWidth={this.batteryWidth}
      />
    );
  }
}

export function BatteryChartComponent(props: BatteryChartChartProps) {
  const defaultThresholdColors = [
    {
      color: "linear-gradient(180deg, #246EFF 0%, #26CE90 100%)",
      startValue: 0,
      endValue: 50,
      headerColor: "#246EFF",
    },
    {
      color: "linear-gradient(180deg, #FF772A 0%, #FFC22A 100%)",
      startValue: 50,
      endValue: 100,
      headerColor: "#FF772A",
    },
  ];
  const {
    value,
    batteryHeight = 58,
    batteryWidth = 38,
    thresholdValue = 50,
    thresholdColors = defaultThresholdColors,
  } = props;
  const calculationRatio = useMemo(() => {
    const lastThreshold = thresholdColors[thresholdColors.length - 1];
    const proportion =
      batteryHeight / (lastThreshold.endValue - thresholdColors[0].startValue); // 比例, lastThreshold.endValue-thresholdColors[0].startValue 值的区间
    const currentThreshold = thresholdColors.find(
      (threshold) =>
        threshold.startValue <= value && threshold.endValue >= value
    );
    return {
      height: proportion * value, // 值的高度
      color: currentThreshold?.color, // 值的颜色
      headerColor: currentThreshold?.headerColor ?? currentThreshold?.color, //头部颜色
      thresholdValueLineHeight: proportion * thresholdValue, // 阈值线的高度
      isFullMarks:
        value === lastThreshold.endValue - thresholdColors[0].startValue,
    };
  }, [value, batteryHeight, thresholdColors, thresholdValue]);
  return (
    <div className="container">
      <div
        className="header"
        style={{
          width: Math.round(batteryWidth / 3),
          background: calculationRatio.headerColor,
          boxShadow: `0 1px 2px 0 ${calculationRatio.headerColor}`,
        }}
      />
      <div
        className="content"
        style={{
          width: batteryWidth,
          height: batteryHeight,
        }}
      >
        <div
          className="threshold"
          style={{
            bottom: calculationRatio.thresholdValueLineHeight - 1,
          }}
        />
        <div
          className="valueWrapper"
          style={{ height: calculationRatio.height }}
        >
          <div
            className="value"
            style={{
              background: calculationRatio.color,
              boxShadow: `0 8px 10px 0 ${calculationRatio.color}`,
              borderRadius: calculationRatio.isFullMarks
                ? "4px"
                : "0 0 4px 4px",
            }}
          />
        </div>
        <div
          className="word"
          style={{
            top: batteryHeight - calculationRatio.thresholdValueLineHeight - 12,
          }}
        >
          <slot name="left" />
        </div>
      </div>
      <slot />
    </div>
  );
}

export { BatteryChart };
