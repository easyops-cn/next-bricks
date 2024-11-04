import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import "@next-core/theme";
import { curveLinear, curveMonotoneX, line } from "d3-shape";
import styleText from "./styles.shadow.css";
import { K, NS, locales } from "./i18n.js";

initializeReactI18n(NS, locales);

const { defineElement, property } = createDecorators();

export interface MiniLineChartProps {
  width?: number;
  height?: number;
  smooth?: boolean;
  lineColor?: string;
  xField?: string;
  yField?: string;
  data?: Record<string, number>[];
}

export type Point = [x: number, y: number];

/**
 * 构件 `eo-mini-line-chart`
 */
export
@defineElement("eo-mini-line-chart", {
  styleTexts: [styleText],
})
class MiniLineChart extends ReactNextElement implements MiniLineChartProps {
  /** @default 155 */
  @property({ type: Number })
  accessor width: number | undefined;

  /** @default 40 */
  @property({ type: Number })
  accessor height: number | undefined;

  /**
   * Use a smooth curve line or not.
   *
   * @default true
   */
  @property({ type: Boolean })
  accessor smooth: boolean | undefined;

  @property()
  accessor lineColor: string | undefined;

  /**
   * @default "0"
   */
  @property()
  accessor xField: string | undefined;

  /**
   * @default "1"
   */
  @property()
  accessor yField: string | undefined;

  @property({ attribute: false })
  accessor data: Record<string, number>[] | undefined;

  render() {
    return (
      <MiniLineChartComponent
        width={this.width}
        height={this.height}
        smooth={this.smooth}
        lineColor={this.lineColor}
        xField={this.xField}
        yField={this.yField}
        data={this.data}
      />
    );
  }
}

export interface MiniLineChartComponentProps extends MiniLineChartProps {
  // Define react event handlers here.
}

export function MiniLineChartComponent({
  width: _width,
  height: _height,
  smooth,
  lineColor,
  xField: _xField,
  yField: _yField,
  data,
}: MiniLineChartComponentProps) {
  const width = _width ?? 155;
  const height = _height ?? 40;
  const xField = _xField ?? "0";
  const yField = _yField ?? "1";
  const padding = 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const { t } = useTranslation(NS);

  const d = useMemo(() => {
    if (!data?.length) {
      return undefined;
    }

    let min = Infinity;
    let max = -Infinity;
    for (const item of data) {
      const value = item[yField];
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }

    if (min === max) {
      const y = min === 0 ? innerHeight : innerHeight / 2;
      return `M${0},${y}L${innerWidth},${y}`;
    }

    const start = data[0][xField];
    const end = data[data.length - 1][xField];
    const xScale = innerWidth / (end - start);
    const yScale = innerHeight / (max - min);

    const path = data.map<Point>((item) => {
      const x = (item[xField] - start) * xScale;
      const y = innerHeight! - (item[yField] - min) * yScale;
      return [x, y];
    });

    // Keep smooth behavior as G2 line chart implementation
    // See https://github.com/antvis/G2/blob/6013d72881276aca9d17d93908d33b21194979c6/src/shape/line/smooth.ts#L20
    return line().curve(smooth === false ? curveLinear : curveMonotoneX)(path)!;
  }, [data, innerHeight, innerWidth, smooth, xField, yField]);

  if (!d) {
    // No data
    return (
      <div style={{ width, height }}>
        <span>{t(K.NO_DATA)}</span>
      </div>
    );
  }

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${padding},${padding})`}>
        <path
          d={d}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
