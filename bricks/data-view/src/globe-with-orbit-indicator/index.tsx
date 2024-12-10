import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import ResizeObserver from "resize-observer-polyfill";
import { formatValue } from "../shared/formatValue";
import { CornerIndictor } from "../shared/CornerIndictor";
import { RotatingArc } from "../globe-with-halo-indicator/RotatingArc";
import { SatelliteRing } from "../globe-with-halo-indicator/SatelliteRing";
import globeMp4 from "./assets/globe.mp4";
import "../fonts/ALiBaBaPuHuiTi.css";
import "../fonts/HarmonyOSSans.css";
import styleText from "./styles.shadow.css";
import cornerStyleText from "../shared/CornerIndictor.shadow.css";

const { defineElement, property } = createDecorators();

export interface GlobeWithOrbitIndicatorProps {
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
  opacity: number;
}

/**
 * 地球加轨道的数据展示构件。
 */
export
@defineElement("data-view.globe-with-orbit-indicator", {
  styleTexts: [styleText, cornerStyleText],
})
class GlobeWithOrbitIndicator
  extends ReactNextElement
  implements GlobeWithOrbitIndicatorProps
{
  /**
   * 指标数据列表（显示在轨道上）
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
      <GlobeWithOrbitIndicatorComponent
        root={this}
        dataSource={this.dataSource}
        centerDataSource={this.centerDataSource}
        cornerDataSource={this.cornerDataSource}
        maxScale={this.maxScale}
      />
    );
  }
}

export interface GlobeWithOrbitIndicatorComponentProps
  extends GlobeWithOrbitIndicatorProps {
  root: GlobeWithOrbitIndicator;
}

export function GlobeWithOrbitIndicatorComponent({
  root,
  dataSource,
  centerDataSource,
  cornerDataSource,
  maxScale,
}: GlobeWithOrbitIndicatorComponentProps) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    // 当容器宽高低于预设值时，图形会自动缩小
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) {
          const { width, height } = entry.contentRect;
          setScale(Math.min(maxScale ?? 1, width / 852, height / 570));
        }
      }
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [maxScale, root]);

  const [labels, setLabels] = useState<DataItemWithPosition[] | null>(null);

  // 计算轨道上标签的位置和动画
  // 1. 按逆时针均匀分布在轨道上
  // 2. 没隔一段时间，轨道上的标签会逐个移动到最前方，并停留一秒
  // 3. 当标签数量达到最大 8 个时，单个卡片的移动时间为 3 秒，停留 1.5 秒
  // 4. 当标签数量为 1 个时，单个卡片的移动时间为 6 秒，停留 3 秒
  // 5. 其他数量时，计算合适的移动时间和停留时间
  // 6. 移动到后半圈时，不透明度逐渐减少，经过 1/4 圈后达到 0.6 并保持，反之亦然
  useEffect(() => {
    const clampedData = dataSource?.slice(0, 8) ?? [];
    if (clampedData.length === 0) {
      setLabels([]);
      return;
    }

    let start: number;
    let timer: number;
    const arc = (Math.PI * 2) / clampedData.length;

    const rx = 367;
    const ry = 170;
    const cx = 426;
    const cy = 330;
    const stay = 3000 - ((clampedData.length - 1) / 7) * 1500;
    // x = 1, y = 6
    // x = 8, y = 3
    // y - 3 = (x - 8)^2 * 3 / 49
    const durationPerLabel =
      (((clampedData.length - 8) ** 2 * 3) / 49 + 3) * 1000;
    const totalPerLabel = durationPerLabel + stay;

    function step(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;

      const count = Math.floor(elapsed / totalPerLabel) % clampedData.length;
      const offset = elapsed % totalPerLabel;
      const progress = offset < stay ? 0 : (offset - stay) / durationPerLabel;
      const startAngle = (Math.PI * 5) / 2 + arc * count + arc * progress;

      setLabels(
        clampedData.map<DataItemWithPosition>((item, index) => {
          const angle = (startAngle - arc * index) % (Math.PI * 2);
          const x = cx + rx * Math.cos(angle);
          const y = cy + ry * Math.sin(angle);
          const opacity =
            angle > Math.PI
              ? angle < (Math.PI * 5) / 4
                ? 1 - ((angle - Math.PI) / (Math.PI / 4)) * 0.4
                : angle > (Math.PI * 7) / 4
                  ? 1 - ((Math.PI * 2 - angle) / (Math.PI / 4)) * 0.4
                  : 0.6
              : 1;
          return { ...item, x, y, opacity };
        })
      );

      timer = requestAnimationFrame(step);
    }

    timer = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(timer);
    };
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
        <svg className="ring" width={852} height={570} viewBox="0 0 852 570">
          <RotatingArc cx={426} cy={300} rx={288} ry={132} />
        </svg>

        <div className="orbit-labels">
          {labels?.map((item, index) => (
            <div
              key={index}
              className="orbit-label-container"
              style={{
                left: item.x,
                top: item.y,
                opacity: item.opacity,
              }}
            >
              <div className="orbit-label">{item.label}</div>
              <div className="orbit-value">{formatValue(item.value)}</div>
            </div>
          ))}
        </div>

        <div className="globe"></div>
        <div className="globe-video-container">
          <video width={389} height={300} autoPlay muted loop playsInline>
            <source src={globeMp4} type="video/mp4" />
          </video>
        </div>

        <SatelliteRing />

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
