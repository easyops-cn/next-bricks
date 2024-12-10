import React, { useEffect, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import ResizeObserver from "resize-observer-polyfill";
import { formatValue } from "../shared/formatValue";
import { CornerIndictor } from "../shared/CornerIndictor";
import { RotatingArc } from "./RotatingArc";
import { SatelliteRing } from "./SatelliteRing";
import particlesWebm from "./assets/particles.webm";
import "../fonts/ALiBaBaPuHuiTi.css";
import styleText from "./styles.shadow.css";
import cornerStyleText from "../shared/CornerIndictor.shadow.css";

const { defineElement, property } = createDecorators();

export interface GlobeWithHaloIndicatorProps {
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
  x: number;
  y: number;
  d: string;
  x2: number;
  y2: number;
}

/**
 * 地球加光环的数据展示构件。
 */
export
@defineElement("data-view.globe-with-halo-indicator", {
  styleTexts: [styleText, cornerStyleText],
})
class GlobeWithHaloIndicator
  extends ReactNextElement
  implements GlobeWithHaloIndicatorProps
{
  /**
   * 指标数据列表（显示在环上）
   *
   * 注意：最多显示8项数据
   */
  @property({ attribute: false })
  accessor dataSource: DataItem[] | undefined;

  /** 中心数据（显示在中心地球内） */
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
      <GlobeWithHaloIndicatorComponent
        root={this}
        dataSource={this.dataSource}
        centerDataSource={this.centerDataSource}
        cornerDataSource={this.cornerDataSource}
        maxScale={this.maxScale}
      />
    );
  }
}

export interface GlobeWithHaloIndicatorComponentProps
  extends GlobeWithHaloIndicatorProps {
  root: GlobeWithHaloIndicator;
}

export function GlobeWithHaloIndicatorComponent({
  root,
  dataSource,
  centerDataSource,
  cornerDataSource,
  maxScale,
}: GlobeWithHaloIndicatorComponentProps) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    // 当容器宽高低于预设值时，图形会自动缩小
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) {
          const { width, height } = entry.contentRect;
          setScale(Math.min(maxScale ?? 1, width / 878, height / 575));
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
  // 4. 总数为奇数时，右侧数据比左侧数据多一个，右侧数据按照等差数列间隔分布，
  //    左侧第 N 个数据的角度为右侧第 N 个和第 N + 1 个数据的角度的中分角
  const labels = useMemo(() => {
    const clampedData = dataSource?.slice(0, 8) ?? [];
    if (clampedData.length === 0) {
      return [];
    }

    const rx = 292.4;
    const ry = 59.4;
    const cx = 413;
    const cy = 65.5;
    const lineBaseDiameter = 340;

    const even = clampedData.length % 2 === 0;
    const m = Math.ceil(clampedData.length / 2) + 1;
    const fractions = getSequenceSum(m);
    const startAngle = -Math.PI / 3;
    const endAngle = Math.PI / 4;
    const arc = (endAngle - startAngle) / fractions;

    let index = 0;
    let x: number;
    let y: number;
    let x2: number;
    let y2: number;
    let r: number;
    let angle: number;
    let lineAngle: number;
    const result: DataItemWithPosition[] = [];
    while (index < clampedData.length) {
      const item = clampedData[index];
      if (index % 2 === 0) {
        const n = index / 2 + 1;
        angle = startAngle + arc * getSequenceSum(n);
        lineAngle = (Math.PI / 3) * (2 - n / m);
        r =
          lineBaseDiameter -
          (m > 2 ? ((lineBaseDiameter / 2) * index) / 2 / (m - 2) : 0);
        x = cx + rx * Math.cos(angle);
        y = cy + ry * Math.sin(angle);
        x2 = x + Math.cos(lineAngle) * r;
        y2 = y - Math.sin(lineAngle) * r;
        const d = `M ${x} ${y} A ${r} ${r} 0 0 0 ${x2} ${y2}`;
        result.push({ ...item, x, y, x2, y2, d });
      } else if (even) {
        const oddX = cx * 2 - x;
        const oddX2 = cx * 2 - x2;
        result.push({
          ...item,
          x: oddX,
          y,
          x2: oddX2,
          y2: y2,
          d: `M ${oddX} ${y} A ${r} ${r} 0 0 1 ${oddX2} ${y2}`,
        });
      } else {
        const oddAngle = Math.PI - (angle + (arc * (index + 1)) / 2);
        const oddLineAngle = Math.PI - lineAngle;
        const oddX = cx + rx * Math.cos(oddAngle);
        const oddY = cy + ry * Math.sin(oddAngle);
        // Assert: m > 2 here
        const oddR = r - lineBaseDiameter / 4 / (m - 2);
        const oddX2 = oddX + Math.cos(oddLineAngle) * oddR;
        const oddY2 = oddY - Math.sin(oddLineAngle) * oddR;
        result.push({
          ...item,
          x: oddX,
          y: oddY,
          x2: oddX2,
          y2: oddY2,
          d: `M ${oddX} ${oddY} A ${oddR} ${oddR} 0 0 1 ${oddX2} ${oddY2}`,
        });
      }
      index++;
    }
    return result;
  }, [dataSource]);

  return (
    <>
      <div
        className="container"
        style={
          {
            visibility: scale === null ? "hidden" : "visible",
            "--scale": scale,
          } as React.CSSProperties & {
            "--scale": number;
          }
        }
      >
        <div className="base"></div>
        <svg className="ring" width={928} height={534} viewBox="0 0 928 534">
          <defs>
            <linearGradient
              id="rotating-arc"
              gradientTransform="rotate(48)"
              x1="0"
              y1="0"
              x2="830px"
              y2="183px"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="rgba(132, 253, 253, 0)" />
              <stop offset="25%" stopColor="rgba(132, 253, 253, 1)" />
              <stop offset="50%" stopColor="rgba(132, 253, 253, 1)" />
              <stop offset="75%" stopColor="rgba(248, 255, 255, 1)" />
            </linearGradient>
          </defs>
          <g transform="translate(51 304)">
            <ellipse
              cx="413"
              cy="89.5"
              rx="412.4"
              ry="88.9"
              fill="none"
              stroke="rgba(123,212,235,255)"
              strokeWidth="1.2"
            >
              <animate
                attributeName="rx"
                values="412.4;0"
                dur="2.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="88.9;0"
                dur="2.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="89.5;10"
                dur="2.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke"
                values="rgba(123,212,235,255);rgba(123,212,235,255);rgba(123,212,235,25)"
                keyTimes="0;0.53846;1"
                dur="2.6s"
                repeatCount="indefinite"
              />
            </ellipse>
            <RotatingArc />
            {labels.map((label, index) => (
              <path
                key={index}
                d={label.d}
                fill="none"
                stroke="#3889B6"
                strokeWidth={2}
                strokeDasharray="6 4"
              ></path>
            ))}
          </g>
        </svg>

        <div className="globe"></div>

        <SatelliteRing />

        <video
          className="particles"
          width={197}
          height={246}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={particlesWebm} type="video/webm" />
        </video>

        <div className="ring-labels">
          {labels.map((item, index) => (
            <div
              key={index}
              className={`ring-label-container ${index % 2 === 0 ? "even" : "odd"}`}
              style={{
                left: item.x2 + 51,
                top: item.y2 + 304,
              }}
            >
              <div className="ring-icon"></div>
              <div className="ring-label">{item.label}</div>
              <div className="ring-value">{formatValue(item.value)}</div>
            </div>
          ))}
        </div>

        <div className="center">
          <div className="center-label">{centerDataSource?.label}</div>
          <div className="center-value">
            {formatValue(centerDataSource?.value)}
          </div>
        </div>
      </div>
      <CornerIndictor cornerDataSource={cornerDataSource} />
    </>
  );
}

function getSequenceSum(n: number) {
  return (n * (n + 1)) / 2;
}
