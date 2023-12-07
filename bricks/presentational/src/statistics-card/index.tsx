import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface EoStatisticsCardProps {
  cardTitle?: string;
  value?: string;
  unit?: string;
  icon?: GeneralIconProps & { color?: string; bgColor?: string };
  size?: "large" | "medium" | "small";
  outline?: "border" | "background" | "none";
  background?: string;
  descriptionPosition?: "bottom" | "right";
}

/**
 * 统计卡片
 *
 * @slot titlePrefix - 标题前缀，放置辅助信息
 * @slot titleSuffix - 标题前缀，放置辅助信息
 * @slot description - 描述信息，通常是对于统计值的描述
 * @slot basicContent - 卡片右侧内容区，适合放置迷你图表，常用于小卡片
 * @slot extraContent - 卡片下方内容区，适合放置图表，用于展示更多信息的场景
 *
 */
export
@defineElement("eo-statistics-card", {
  styleTexts: [styleText],
})
class EoStatisticsCard extends ReactNextElement {
  /**
   * 卡片标题
   */
  @property()
  accessor cardTitle: string | undefined;

  /**
   * 值
   */
  @property()
  accessor value: string | undefined;

  /**
   * 单位
   */
  @property()
  accessor unit: string | undefined;

  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor icon: EoStatisticsCardProps["icon"] | undefined;

  /**
   * 尺寸
   */
  @property()
  accessor size: "large" | "medium" | "small" = "medium";

  /**
   * 卡片轮廓
   */
  @property()
  accessor outline: "border" | "background" | "none" = "border";

  /**
   * 背景
   */
  @property()
  accessor background: string | undefined;

  /**
   * 描述位置
   */
  @property()
  accessor descriptionPosition: "bottom" | "right" = "bottom";

  render() {
    return (
      <EoStatisticsCardComponent
        cardTitle={this.cardTitle}
        value={this.value}
        unit={this.unit}
        icon={this.icon}
        background={this.background}
        descriptionPosition={this.descriptionPosition}
      />
    );
  }
}

export function EoStatisticsCardComponent(props: EoStatisticsCardProps) {
  const { cardTitle, value, unit, icon, background, descriptionPosition } =
    props;

  const iconNode = useMemo(() => {
    if (!icon) return null;
    return (
      <div className="icon-container" style={{ backgroundColor: icon.bgColor }}>
        <WrappedIcon {...icon} className="icon" style={{ color: icon.color }} />
      </div>
    );
  }, [icon]);

  return (
    <div className="card" style={{ ...(background ? { background } : {}) }}>
      <div className="basic-container">
        {iconNode}
        <div className="basic-info">
          <div className="title-container">
            <slot name="titlePrefix" />
            <div className="card-title">{cardTitle}</div>
            <slot name="titleSuffix" />
          </div>
          <div className="value-container">
            <span className="value">{value}</span>
            {unit && <span className="unit">{unit}</span>}
            {descriptionPosition === "right" && <slot name="description" />}
          </div>
          {descriptionPosition === "bottom" && <slot name="description" />}
        </div>
        <slot name="basicContent" />
      </div>
      <slot name="extraContent" />
    </div>
  );
}
