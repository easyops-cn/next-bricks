import React, { useEffect, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import ResizeObserver from "resize-observer-polyfill";
import { formatValue } from "../shared/formatValue";
import { CornerIndicator } from "../shared/CornerIndicator";
import type { GearBackground, GearBackgroundProps } from "../gear-background";
import "../fonts/ALiBaBaPuHuiTi.css";
import "../fonts/HarmonyOSSans.css";
import styleText from "./styles.shadow.css";
import cornerStyleText from "../shared/CornerIndicator.shadow.css";

const BASE_WIDTH = 930;
const BASE_HEIGHT = 590;
const MAX_LINE_Y = BASE_HEIGHT - 2;
const BASE_LINE_WIDTH = 150;

const PALETTE: string[] = [
  "#83F5E1",
  "#FE8328",
  "#296DFF",
  "#214ED2",
  "#9CC5FF",
  "#67E0D8",
  "#BF145B",
  "#4FAAFF",
  "#5245E2",
  "#9281EE",
  "#F8AB05",
  "#2C9966",
  // "#CAD1DB",
  // "#88909B",
  // "#00A7CC",
  // "#50FFFF",
  // "#3366FF",
  // "#99CCFF",
  // "#6600FF",
  // "#9999FF",
];

const RING_RADIUS = 229;
const RING_CX = 465;
const RING_CY = 317;

const WrappedGearBackground = wrapBrick<GearBackground, GearBackgroundProps>(
  "data-view.gear-background"
);

const { defineElement, property } = createDecorators();

export interface GlobeWithGearIndicatorProps {
  dataSource?: DataItem[];
  centerDataSource?: DataItem;
  cornerDataSource?: CornerDataItem[];
  maxScale?: number;
}

export interface DataItem {
  label: string;
  value: string | number;
}

export interface CornerDataItem extends DataItem {
  color?: string;
}

interface DataItemWithPosition extends DataItem {
  color: string;
  x: number;
  y: number;
  x2: number;
  y2: number;
  x3: number;
}

/**
 * 地球加轮盘的数据展示构件。
 */
export
@defineElement("data-view.globe-with-gear-indicator", {
  styleTexts: [styleText, cornerStyleText],
})
class GlobeWithGearIndicator
  extends ReactNextElement
  implements GlobeWithGearIndicatorProps
{
  /** 指标数据列表（显示在环上）
   *
   * 注意：最多显示12项数据
   */
  @property({ attribute: false })
  accessor dataSource: DataItem[] | undefined;

  /** 中心数据（显示在中心水晶球内） */
  @property({ attribute: false })
  accessor centerDataSource: DataItem | undefined;

  /**
   * 左上角指标数据列表
   */
  @property({ attribute: false })
  accessor cornerDataSource: CornerDataItem[] | undefined;

  /**
   * 最大缩放比例
   *
   * @default 1
   */
  @property({ type: Number })
  accessor maxScale: number | undefined;

  render() {
    return (
      <GlobeWithGearIndicatorComponent
        root={this}
        dataSource={this.dataSource}
        centerDataSource={this.centerDataSource}
        cornerDataSource={this.cornerDataSource}
        maxScale={this.maxScale}
      />
    );
  }
}

export interface GlobeWithGearIndicatorComponentProps
  extends GlobeWithGearIndicatorProps {
  root: GlobeWithGearIndicator;
}

export function GlobeWithGearIndicatorComponent({
  root,
  dataSource,
  centerDataSource,
  cornerDataSource,
  maxScale,
}: GlobeWithGearIndicatorComponentProps) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    // 当容器宽高低于预设值时，图形会自动缩小
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) {
          const { width, height } = entry.contentRect;
          // 宽度大于高度，因为有水平方向排列的标签文字
          setScale(
            Math.min(maxScale ?? 1, width / BASE_WIDTH, height / BASE_HEIGHT)
          );
        }
      }
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [maxScale, root]);

  // 计算环上标签的位置
  // 1. 将数据分为两组，分别在环的两侧
  // 2. 索引（从 0 开始）为偶数的数据在右侧，索引为奇数的数据在左侧
  // 3. 总数为偶数时，两侧数据对称，每组数据按照角度均匀分布
  // 4. 总数为奇数时，右侧数据比左侧数据多一个，右侧数据按照角度均匀分布，
  //    左侧第 N 个数据的角度为右侧第 N 个和第 N + 1 个数据的角度的中分角
  const labels = useMemo(() => {
    const clampedData = dataSource?.slice(0, 12) ?? [];
    if (clampedData.length === 0) {
      return [];
    }

    const half = Math.ceil(clampedData.length / 2);
    const even = clampedData.length % 2 === 0;
    const arc = Math.PI / (half + 1);

    let index = 0;
    let angle: number;
    const result: DataItemWithPosition[] = [];
    while (index < clampedData.length) {
      const item = clampedData[index];
      const color = PALETTE[index % PALETTE.length];
      if (index % 2 === 0) {
        angle = arc * (index / 2 + 1) - Math.PI / 2;
        result.push({ ...item, color, ...getLinePosition(angle, true) });
      } else {
        const oddAngle = even ? Math.PI - angle : Math.PI - (angle + arc / 2);
        result.push({ ...item, color, ...getLinePosition(oddAngle, false) });
      }
      index++;
    }
    return result;
  }, [dataSource]);

  return (
    <>
      <div
        className="gear-container"
        style={
          {
            visibility: scale === null ? "hidden" : "visible",
            "--scale": scale,
          } as React.CSSProperties & {
            "--scale": number;
          }
        }
      >
        <WrappedGearBackground color="#3366FF" className="gear" />
        <div className="center">
          <div className="dots"></div>
          <div className="radar"></div>
          <div className="globe"></div>
          {centerDataSource && (
            <div className="center-border level-1">
              <div className="center-border level-2">
                <div className="center-border level-3">
                  <div className="center-border level-4">
                    <div className="center-value">
                      {formatValue(centerDataSource?.value)}
                    </div>
                    <div className="center-label">
                      {centerDataSource?.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="light"></div>
        </div>
        <svg
          className="ring-lines"
          width={BASE_WIDTH}
          height={BASE_HEIGHT}
          viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
        >
          {labels.map((item, index) => (
            <g key={index} strokeWidth={2} fill="none">
              <path
                d={`M ${item.x} ${item.y} L ${item.x2} ${item.y2} H ${item.x3}`}
                stroke="rgba(255,255,255,0.2)"
              />
              <path
                d={`M ${item.x3} ${item.y2} h ${(index % 2 === 0 ? 1 : -1) * 13}`}
                stroke={item.color}
              />
            </g>
          ))}
        </svg>
        <div className="ring-labels">
          {labels.map((item, index) => (
            <div
              key={index}
              className={`ring-label-container ${index % 2 === 0 ? "even" : "odd"}`}
              style={{
                width: Math.abs(item.x3 - item.x2),
                left: index % 2 === 0 ? item.x2 : item.x3,
                top: item.y2 - 60,
              }}
            >
              <div className="ring-label-box">
                <div
                  className="ring-icon"
                  style={{ background: item.color }}
                ></div>
                <div className="ring-label">{item.label}</div>
                <div className="ring-value">{formatValue(item.value)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CornerIndicator cornerDataSource={cornerDataSource} />
    </>
  );
}

function getLinePosition(angle: number, even: boolean) {
  const x = RING_CX + RING_RADIUS * Math.cos(angle);
  const y = RING_CY + RING_RADIUS * Math.sin(angle);
  let x2: number;
  let y2: number;
  let x3: number;
  const baseWidth = (even ? 1 : -1) * BASE_LINE_WIDTH;
  if (even ? angle > 0 : angle < Math.PI) {
    const width =
      baseWidth *
      ((even ? angle < Math.PI / 4 : angle > (Math.PI * 3) / 4)
        ? 2 * (1 + ((even ? -1 : 1) * Math.cos(angle)) / 2)
        : 1);
    const lineAngle = even ? Math.PI / 6 : (Math.PI * 5) / 6;
    const lineRadius =
      72 / Math.cos(angle - lineAngle) / ((even ? 1 : -1) * Math.cos(angle));
    y2 = y + lineRadius * Math.sin(lineAngle);
    if (y2 > MAX_LINE_Y) {
      y2 = MAX_LINE_Y;
      x2 = x + (y2 - y) / Math.tan(lineAngle);
    } else {
      x2 = x + lineRadius * Math.cos(lineAngle);
    }
    x3 = x2 + width;
  } else {
    const width = baseWidth;
    const lineAngle = even ? -Math.PI / 6 : (Math.PI * 7) / 6;
    const lineRadius = 72 / Math.cos(angle - lineAngle);
    x2 = x + lineRadius * Math.cos(lineAngle);
    y2 = y + lineRadius * Math.sin(lineAngle);
    x3 = x2 + width;
  }
  return { x, y, x2, y2, x3 };
}
