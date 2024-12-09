import React, { useEffect, useMemo, useState } from "react";
import {
  forceSimulation,
  forceCollide,
  forceManyBody,
  forceX,
  forceY,
  forceCenter,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import ResizeObserver from "resize-observer-polyfill";
import type { Tag, TagProps } from "@next-bricks/basic/tag";
import "../fonts/ALiBaBaPuHuiTi.css";
import "../fonts/PangMenZhengDaoBiaoTiTi.css";
import styleText from "./styles.shadow.css";

const BASE_WIDTH = 800;
const BASE_HEIGHT = 640;
const CENTER_BUBBLE_RADIUS = 196;
const OTHER_BUBBLE_MAX_RADIUS = 81;
const OTHER_BUBBLE_MIN_RADIUS = 40;
const BUBBLE_PADDING = 12;
const RANDOM_BUBBLE_MIN_RADIUS = 10;
const RANDOM_BUBBLE_MAX_RADIUS = 22;
const TOTAL_BUBBLE_COUNT = 18;

const numberFormatter = new Intl.NumberFormat("zh-CN", {
  useGrouping: true,
});

const WrappedTag = wrapBrick<Tag, TagProps>("eo-tag");

const { defineElement, property } = createDecorators();

export interface BubblesIndicatorProps {
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
  r: number;
  isRandom?: boolean;
}

interface ForceNode extends SimulationNodeDatum {
  r: number;
  isRandom?: boolean;
}

interface NumberedDataItem extends DataItem {
  positiveNumberValue: number;
}

/**
 * 气泡样式的数据展示构件。
 */
export
@defineElement("data-view.bubbles-indicator", {
  styleTexts: [styleText],
})
class BubblesIndicator
  extends ReactNextElement
  implements BubblesIndicatorProps
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
      <BubblesIndicatorComponent
        root={this}
        dataSource={this.dataSource}
        centerDataSource={this.centerDataSource}
        cornerDataSource={this.cornerDataSource}
        maxScale={this.maxScale}
      />
    );
  }
}

export interface BubblesIndicatorComponentProps extends BubblesIndicatorProps {
  root: BubblesIndicator;
}

export function BubblesIndicatorComponent({
  root,
  dataSource,
  centerDataSource,
  cornerDataSource,
  maxScale,
}: BubblesIndicatorComponentProps) {
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

  // 使用 d3 力学布局计算气泡位置，将普通数据排列在中心数据周围，并填充一些小的气泡
  const labels = useMemo(() => {
    const numberedDataSource: NumberedDataItem[] =
      dataSource?.slice(0, 12)?.map((item) => ({
        ...item,
        positiveNumberValue: Math.abs(
          typeof item.value === "number" ? item.value : parseFloat(item.value)
        ),
      })) ?? [];
    const positiveNumberValues = numberedDataSource.map(
      (item) => item.positiveNumberValue
    );
    const maxPositiveNumberValue = Math.max(...positiveNumberValues);

    const nodes = [centerDataSource, ...numberedDataSource].map<ForceNode>(
      (item, index) =>
        index === 0
          ? {
              r: CENTER_BUBBLE_RADIUS,
              fx: 0,
              fy: 0,
            }
          : {
              r: Math.max(
                OTHER_BUBBLE_MIN_RADIUS,
                Math.min(
                  OTHER_BUBBLE_MAX_RADIUS,
                  Math.sqrt(
                    (item as NumberedDataItem).positiveNumberValue /
                      maxPositiveNumberValue
                  ) * OTHER_BUBBLE_MAX_RADIUS
                )
              ),
            }
    );

    // 补齐气泡数量，新增的随机气泡大小在指定范围内均匀分布，而不是使用随机数，以便对于同一份数据得到相同的布局结果。
    const randomCount = TOTAL_BUBBLE_COUNT - nodes.length;
    const randomNodes = Array.from<unknown, ForceNode>(
      { length: randomCount },
      (_v, i) => ({
        isRandom: true,
        r:
          RANDOM_BUBBLE_MIN_RADIUS +
          (i * (RANDOM_BUBBLE_MAX_RADIUS - RANDOM_BUBBLE_MIN_RADIUS)) /
            randomCount,
      })
    );

    nodes.push(...randomNodes);

    const simulation = forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", forceX().strength(0.01))
      .force("y", forceY().strength(0.02))
      .force("center", forceCenter(0, 0).strength(0.5))
      .force(
        "collide",
        forceCollide<ForceNode>()
          .radius((d) => d.r + BUBBLE_PADDING)
          .iterations(3)
      )
      .force(
        "charge",
        forceManyBody()
          //.strength((_d, i) => (/* i ? 0 : */ (-BASE_WIDTH * 1) / 3))
          .strength(-84)
      );

    simulation.stop();
    manuallyTickToTheEnd(simulation);

    return nodes.slice(1).map<DataItemWithPosition>((node, index) => ({
      ...(node.isRandom
        ? { isRandom: true, label: "", value: "" }
        : dataSource[index]),
      x: node.x!,
      y: node.y!,
      r: node.r,
    }));
  }, [centerDataSource, dataSource]);

  return (
    <>
      <div
        className="bubbles-container"
        style={
          {
            visibility: scale === null ? "hidden" : "visible",
            "--scale": scale,
          } as React.CSSProperties & {
            "--scale": number;
          }
        }
      >
        <div className="bg"></div>
        <div className="outer-ring"></div>
        <div className="inner-ring"></div>
        <div className="center">
          <div className="center-label">{centerDataSource?.label}</div>
          <div className="center-value">
            {formatValue(centerDataSource?.value)}
          </div>
        </div>
        <div className="light"></div>
        <div className="bubbles">
          {labels?.map((item, index) => (
            <div
              key={index}
              className="bubble"
              style={{
                transform: `translate(${item.x}px, ${item.y}px)`,
                width: item.r * 2,
                height: item.r * 2,
                // Put extra random bubbles to the back layer.
                zIndex: item.isRandom ? -1 : 0,
              }}
            >
              {!item.isRandom && (
                <>
                  <div className="bubble-label">{item.label}</div>
                  <div className="bubble-value">{formatValue(item.value)}</div>
                </>
              )}
            </div>
          ))}
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

function manuallyTickToTheEnd(
  simulation: Simulation<ForceNode, SimulationLinkDatum<ForceNode>>
): void {
  // Manually tick to the end.
  simulation.tick(
    Math.ceil(
      Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
    )
  );
}
