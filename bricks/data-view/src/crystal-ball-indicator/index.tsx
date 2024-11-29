import React, { useEffect, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import ResizeObserver from "resize-observer-polyfill";
import type { Tag, TagProps } from "@next-bricks/basic/tag";
import crystalBallVideo from "./assets/crystal-ball.mp4";
import "../fonts/ALiBaBaPuHuiTi.css";
import "../fonts/PangMenZhengDaoBiaoTiTi.css";
import styleText from "./styles.shadow.css";

const RING_SIZE = 572;
const RING_OFFSET = 16;

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  useGrouping: true,
});

const WrappedTag = wrapBrick<Tag, TagProps>("eo-tag");

const { defineElement, property } = createDecorators();

export interface CrystalBallIndicatorProps {
  dataSource?: DataItem[];
  centerLabel?: string;
  centerValue?: string | number;
  cornerDataSource?: cornerDataItem[];
  maxScale?: number;
}

export interface DataItem {
  label: string;
  value: string | number;
}

export interface cornerDataItem extends DataItem {
  color?: string;
}

interface DataItemWithPosition extends DataItem {
  x: number;
  y: number;
}

/**
 * 中间是水晶球动画的数据展示构件
 */
export
@defineElement("data-view.crystal-ball-indicator", {
  styleTexts: [styleText],
})
class CrystalBallIndicator
  extends ReactNextElement
  implements CrystalBallIndicatorProps
{
  @property({ attribute: false })
  accessor dataSource: DataItem[] | undefined;

  @property()
  accessor centerLabel: string | undefined;

  @property({ attribute: false })
  accessor centerValue: string | number | undefined;

  @property({ attribute: false })
  accessor cornerDataSource: cornerDataItem[] | undefined;

  @property({ type: Number })
  accessor maxScale: number | undefined;

  render() {
    return (
      <CrystalBallIndicatorComponent
        root={this}
        dataSource={this.dataSource}
        centerLabel={this.centerLabel}
        centerValue={this.centerValue}
        cornerDataSource={this.cornerDataSource}
        maxScale={this.maxScale}
      />
    );
  }
}

export interface CrystalBallIndicatorComponentProps
  extends CrystalBallIndicatorProps {
  root: CrystalBallIndicator;
}

export function CrystalBallIndicatorComponent({
  root,
  dataSource,
  centerLabel,
  centerValue,
  cornerDataSource,
  maxScale,
}: CrystalBallIndicatorComponentProps) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) {
          const { width, height } = entry.contentRect;
          // Width is larger than height, because there are horizontal labels
          setScale(Math.min(maxScale ?? 1, width / 810, height / 604));
        }
      }
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [maxScale, root]);

  const labels = useMemo(() => {
    const clampedData = dataSource?.slice(0, 20) ?? [];
    if (clampedData.length === 0) {
      return [];
    }

    const half = Math.ceil(clampedData.length / 2);
    const even = clampedData.length % 2 === 0;
    const arc = Math.PI / (half + 1);
    const radius = RING_SIZE / 2;
    const center = radius + RING_OFFSET;

    let index = 0;
    let x: number;
    let y: number;
    let angle: number;
    const result: DataItemWithPosition[] = [];
    while (index < clampedData.length) {
      const item = clampedData[index];
      if (index % 2 === 0) {
        angle = arc * (index / 2 + 1) - Math.PI / 2;
        x = center + radius * Math.cos(angle);
        y = center + radius * Math.sin(angle);
        result.push({ ...item, x, y });
      } else if (even) {
        result.push({ ...item, x: center * 2 - x, y });
      } else {
        const oddAngle = Math.PI - (angle + arc / 2);
        result.push({
          ...item,
          x: center + radius * Math.cos(oddAngle),
          y: center + radius * Math.sin(oddAngle),
        });
      }
      index++;
    }
    return result;
  }, [dataSource]);

  return (
    <>
      <div
        className="circle-container"
        style={
          {
            visibility: scale === null ? "hidden" : "visible",
            "--scale": scale,
          } as React.CSSProperties & {
            "--scale": number;
          }
        }
      >
        <div className="ring-container">
          <div className="ring"></div>
          <div className="video-container">
            <video width={352} height={352} autoPlay muted loop playsInline>
              <source src={crystalBallVideo} type="video/mp4" />
            </video>
          </div>
        </div>
        {labels.map((item, index) => (
          <div
            key={index}
            className={`ring-labels ${index % 2 === 0 ? "even" : "odd"}`}
            style={{
              left: item.x,
              top: item.y,
            }}
          >
            <div className="ring-icon"></div>
            <div className="ring-label">{item.label}</div>
            <div className="ring-value">{formatValue(item.value)}</div>
          </div>
        ))}
        <div className="center">
          <div className="center-label">{centerLabel}</div>
          <div className="center-value">{formatValue(centerValue)}</div>
        </div>
      </div>
      <div className="corner">
        {cornerDataSource?.map((item, index) => (
          <div key={index} className="corner-item">
            <div className="corner-label">{item.label}</div>
            <WrappedTag
              className="corner-value"
              outline
              color={item.color}
              tagStyle={{
                fontSize: 18,
                padding: "2px 16px",
              }}
            >
              {formatValue(item.value)}
            </WrappedTag>
          </div>
        ))}
      </div>
    </>
  );
}

function formatValue(value: string | number): string {
  return typeof value === "number" ? numberFormatter.format(value) : value;
}
