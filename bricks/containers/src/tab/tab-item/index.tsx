import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./tab-item.shadow.css";
import classNames from "classnames";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { TabType } from "../../interface.js";
import { EoCounterBadge, BadgeProps } from "@next-bricks/basic/counter-badge";

const { defineElement, property } = createDecorators();

const WrappedBadge = wrapBrick<EoCounterBadge, BadgeProps>("eo-counter-badge");

export interface TabItemProps {
  type?: TabType;
  text?: string;
  panel: string;
  icon?: GeneralIconProps;
  disabled?: boolean;
  hidden?: boolean;
  active?: boolean;
  badgeConf?: BadgeProps;
  panelColor?: string;
}

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * Tab 子项构件
 * @en Tab item brick
 * @author sailorshe
 * @insider
 */
@defineElement("eo-tab-item", {
  styleTexts: [styleText],
  alias: ["containers.tab-item"],
})
class TabItem extends ReactNextElement {
  /**
   * 样式类型
   * @en Style type
   *
   * @default "default"
   */
  @property()
  accessor type: TabType = "default";

  /**
   * 面板名称，对应 tab-group 中的 slot 名称，用于关联内容面板
   * @en Panel name, corresponding to the slot name in tab-group, used to associate the content panel
   * @required
   */
  @property()
  accessor panel: string;

  /**
   * 图标配置，显示在标签文字左侧
   * @en Icon configuration, displayed on the left of the label text
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps;

  /**
   * 是否禁用，禁用后点击无响应且样式置灰
   * @en Whether it is disabled; when disabled, clicks have no effect and the style is grayed out
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean;

  /**
   * 是否为激活状态，通常由 tab-group 自动管理
   * @en Whether it is in the active state, usually managed automatically by tab-group
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean;

  /**
   * 徽标数配置，显示在标签文字右侧或右上角（panel 类型时）
   * @en Badge configuration, displayed on the right of the label text or at the top-right corner (for panel type)
   */
  @property({
    attribute: false,
  })
  accessor badgeConf: BadgeProps;

  /**
   * 面板颜色，同时控制默认状态和激活状态的文字及图标颜色
   * @en Panel color, which controls the text and icon colors in both the default and active states
   */
  @property()
  accessor panelColor: string | undefined;

  render() {
    return (
      <TabItemElement
        panel={this.panel}
        icon={this.icon}
        disabled={this.disabled}
        hidden={this.hidden}
        active={this.active}
        badgeConf={this.badgeConf}
        panelColor={this.panelColor}
      />
    );
  }
}

function TabItemElement({
  panel,
  icon,
  disabled,
  hidden,
  active,
  badgeConf,
  panelColor,
}: TabItemProps): React.ReactElement {
  const handleTabSelect = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  return (
    <div
      className={classNames("tab-item", {
        disabled,
      })}
      key={panel}
      hidden={hidden}
      aria-selected={active}
      onClick={handleTabSelect}
      part="tab-item"
      style={
        {
          "--tab-item-default-color": panelColor ?? "var(--color-normal-text)",
          "--tab-item-active-color": panelColor ?? "var(--color-brand)",
        } as React.CSSProperties
      }
    >
      {icon && <WrappedIcon className="tab-item-icon" {...icon} />}
      <slot />
      {badgeConf && (
        <WrappedBadge
          {...{
            color: "var(--color-fill-bg-base-1)",
            fontColor: "var(--color-normal-text)",
            ...badgeConf,
          }}
          className="tab-item-badge"
        />
      )}
    </div>
  );
}

export { TabItem };
