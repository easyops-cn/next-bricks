import React, { useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classnames from "classnames";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface BadgeProps {
  count?: number;
  overflowCount?: number;
  dot?: boolean;
  offset?: [number, number];
  showZero?: boolean;
  color?: string;
  fontColor?: string;
  icon?: GeneralIconProps;
}
const { defineElement, property } = createDecorators();

/**
 * 通用徽标构件
 * @en A general-purpose badge brick
 * @author zhendonghuang
 * @slot - 内容区
 * @slotEn - The content area
 * @category display-component
 */
export
@defineElement("eo-counter-badge", {
  styleTexts: [styleText],
})
class EoCounterBadge extends ReactNextElement {
  /**
   * 在内容中使用Icon
   * @en Use Icon in the content
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 徽标的背景颜色。
   * @en The background color of the badge.
   */
  @property()
  accessor color: string | undefined;

  /**
   * 微标的字体颜色
   * @en The font color of the badge
   */
  @property()
  accessor fontColor: string | undefined;

  /**
   * 展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏
   * @en The number to display; shown as ${overflowCount}+ when greater than overflowCount, and hidden when it is 0
   */
  @property({
    type: Number,
  })
  accessor count: number | undefined;

  /**
   * 展示封顶的数字值
   * @en The capped value of the displayed number
   * @default true
   */
  @property({
    type: Number,
  })
  accessor overflowCount: number | undefined;

  /**
   * 不展示数字，只有一个小圆点.
   * @en Do not display the number, only a small dot.
   */
  @property({
    type: Boolean,
  })
  accessor dot: boolean | undefined;

  /**
   * 设置状态点的位置偏移，格式为 [x, y]
   * @en Set the position offset of the status dot; the format is [x, y]
   */
  @property({
    attribute: false,
  })
  accessor offset: [number, number] | undefined;

  /**
   * 当数值为 0 时，是否展示徽标
   * @en Whether to display the badge when the value is 0
   */
  @property({
    type: Boolean,
  })
  accessor showZero: boolean | undefined;

  render() {
    return (
      <EoCounterBadgeComponent
        showZero={this.showZero}
        dot={this.dot}
        count={this.count}
        overflowCount={this.overflowCount}
        offset={this.offset}
        color={this.color}
        fontColor={this.fontColor}
        icon={this.icon}
      />
    );
  }
}

export function EoCounterBadgeComponent(props: BadgeProps) {
  const {
    overflowCount = 99,
    color = "var(--theme-red-color)",
    fontColor = "#ffffff",
    count = 0,
    showZero,
    dot,
    offset = [0, 0],
    icon,
  } = props;
  const [noContent, setNoContent] = useState<boolean>();
  const slotRef = useRef<HTMLSlotElement>(null);

  useEffect(() => {
    const slotElement = slotRef.current;

    /* istanbul ignore if */
    if (!slotElement) {
      return;
    }

    const listener = () => {
      setNoContent(slotElement.assignedNodes().length === 0);
    };

    listener();
    slotElement.addEventListener("slotchange", listener);

    return () => {
      slotElement.removeEventListener("slotchange", listener);
    };
  }, []);

  const showCount = React.useMemo(() => {
    return count > overflowCount ? `${overflowCount}+` : count;
  }, [overflowCount, count]);

  return (
    <span
      className={classnames("badgeContainer", {
        noContent: noContent && !icon,
      })}
    >
      {icon && <WrappedIcon {...icon} />}
      <slot ref={slotRef}></slot>
      {(showZero || !!count) && (
        <sup
          className={classnames("countContent", { badgeDot: dot })}
          style={{
            background: color,
            color: fontColor,
            marginTop: offset[1],
            right: -offset[0],
          }}
        >
          {dot ? null : showCount}
        </sup>
      )}
    </span>
  );
}
