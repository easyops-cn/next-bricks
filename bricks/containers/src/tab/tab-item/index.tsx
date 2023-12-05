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
   *
   * @default "default"
   */
  @property()
  accessor type: TabType;

  /**
   * @default
   * @required
   * @description 面板名称
   */
  @property()
  accessor panel: string;

  /**
   * @default
   * @required
   * @description 图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps;

  /**
   * @default
   * @required
   * @description 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean;

  /**
   * @default
   * @required
   * @description 是否激活状态
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean;

  /**
   * @default
   * @required
   * @description 徽标数的配置
   */
  @property({
    attribute: false,
  })
  accessor badgeConf: BadgeProps;

  /**
   * 面板颜色
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
      style={
        {
          "--tab-item-default-color":
            panelColor ?? "var(--antd-tabs-title-color)",
          "--tab-item-active-color":
            panelColor ?? "var(--antd-tabs-title-selected-color)",
        } as React.CSSProperties
      }
    >
      {icon && <WrappedIcon className="tab-item-icon" {...icon} />}
      <slot />
      {badgeConf && <WrappedBadge {...badgeConf} className="tab-item-badge" />}
    </div>
  );
}

export { TabItem };
