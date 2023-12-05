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
 * 构件 `nav.launchpad-config`
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
        onActionClick={this.#onActionClick}
      />
    );
  }
}

export interface LaunchpadConfigProps {
  menuGroups?: ConfigMenuGroup[];
  actions?: MenuAction[];
  onActionClick?: (detail: MenuActionEventDetail) => void;
}

export function LaunchpadConfigComponent({
  menuGroups,
  actions,
  onActionClick,
}: LaunchpadConfigProps) {
  return (
    <ul className="menu-groups">
      {menuGroups?.map((group) => (
        <MenuGroup
          key={group.instanceId}
          data={group}
          actions={actions}
          onActionClick={onActionClick}
        />
      ))}
    </ul>
  );
}
