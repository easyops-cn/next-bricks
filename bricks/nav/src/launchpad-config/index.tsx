import React from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type {
  ConfigMenuGroup,
  MenuAction,
  MenuActionEventDetail,
} from "./interfaces";
import { MenuGroup } from "./MenuGroup";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

/**
 * 进行 Launchpad 配置。
 *
 * 也可用于菜单自定义显示产品功能清单。
 *
 * @insider
 */
export
@defineElement("nav.launchpad-config", {
  styleTexts: [styleText],
})
class LaunchpadConfig extends ReactNextElement implements LaunchpadConfigProps {
  @property({ attribute: false })
  accessor menuGroups: ConfigMenuGroup[] | undefined;

  @property({ attribute: false })
  accessor actions: MenuAction[] | undefined;

  /**
   * @default "launchpad-config"
   */
  @property()
  accessor variant: "launchpad-config" | "menu-config" | undefined;

  /**
   * 菜单项 APP 类型的链接模板，例如可配置为 `/app/{{ id }}`。
   *
   * 注：仅用于 variant: "menu-config"。
   */
  @property()
  accessor urlTemplate: string | undefined;

  /**
   * 菜单项自定义类型的链接模板，例如可配置为 `/custom?url={{ __pathname }}`。
   *
   * 注：仅用于 variant: "menu-config"。
   *    外链菜单链接会设置为禁用。
   *    `__pathname` 是运行时变量，表示 url 解析后的 pathname。
   */
  @property()
  accessor customUrlTemplate: string | undefined;

  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<MenuActionEventDetail>;

  #onActionClick = (detail: MenuActionEventDetail) => {
    this.#actionClickEvent.emit(detail);
  };

  render() {
    return (
      <LaunchpadConfigComponent
        menuGroups={this.menuGroups}
        actions={this.actions}
        variant={this.variant}
        urlTemplate={this.urlTemplate}
        customUrlTemplate={this.customUrlTemplate}
        onActionClick={this.#onActionClick}
      />
    );
  }
}

export interface LaunchpadConfigProps {
  menuGroups?: ConfigMenuGroup[];
  actions?: MenuAction[];
  variant?: "launchpad-config" | "menu-config";
  urlTemplate?: string;
  customUrlTemplate?: string;
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

export function LaunchpadConfigComponent({
  menuGroups,
  actions,
  variant,
  urlTemplate,
  customUrlTemplate,
  onActionClick,
}: LaunchpadConfigProps) {
  return (
    <ul className="menu-groups">
      {menuGroups?.map((group) => (
        <MenuGroup
          key={group.instanceId}
          data={group}
          actions={actions}
          variant={variant}
          urlTemplate={urlTemplate}
          customUrlTemplate={customUrlTemplate}
          onActionClick={onActionClick}
        />
      ))}
    </ul>
  );
}
