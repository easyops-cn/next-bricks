import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { formatValue } from "../shared/formatValue";
import { CornerIndicator } from "../shared/CornerIndicator";
import { useContainerScale } from "../shared/useContainerScale";
import { useCenterScale } from "../shared/useCenterScale";
import crystalBallVideo from "./assets/crystal-ball.mp4";
import "../fonts/ALiBaBaPuHuiTi.css";
import "../fonts/PangMenZhengDaoBiaoTiTi.css";
import styleText from "./styles.shadow.css";
import cornerStyleText from "../shared/CornerIndicator.shadow.css";

const RING_SIZE = 572;
const RING_OFFSET = 16;

const { defineElement, property } = createDecorators();

export interface CrystalBallIndicatorProps {
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
}

/**
 * 有水晶球动画的数据展示构件。
 */
export
@defineElement("data-view.crystal-ball-indicator", {
  styleTexts: [styleText, cornerStyleText],
})
class CrystalBallIndicator
  extends ReactNextElement
  implements CrystalBallIndicatorProps
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
      <CrystalBallIndicatorComponent
        root={this}
        dataSource={this.dataSource}
        centerDataSource={this.centerDataSource}
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
  centerDataSource,
  cornerDataSource,
  maxScale,
}: CrystalBallIndicatorComponentProps) {
  const scale = useContainerScale({ width: 810, height: 604, root, maxScale });
  const [centerValueScale, centerValueRef] = useCenterScale(280);

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
        <div className="base"></div>
        <div className="ring-container">
          <div className="ring"></div>
          <div className="video-container">
            <video width={352} height={352} autoPlay muted loop playsInline>
              <source src={crystalBallVideo} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="ring-labels">
          {labels.map((item, index) => (
            <div
              key={index}
              className={`ring-label-container ${index % 2 === 0 ? "even" : "odd"}`}
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
        </div>
        <div className="center">
          <div className="center-label">{centerDataSource?.label}</div>
          <div
            className="center-value"
            ref={centerValueRef}
            style={{
              visibility: centerValueScale === null ? "hidden" : "visible",
              transform: `scale(${centerValueScale ?? 1})`,
            }}
          >
            {formatValue(centerDataSource?.value)}
          </div>
        </div>
      </div>
      <CornerIndicator cornerDataSource={cornerDataSource} />
    </>
  );
}
