import React, { useState, useEffect } from "react";
import { createDecorators } from "@next-core/element";
import { getHistory } from "@next-core/runtime";
import {
  WorkbenchAction,
  WorkbenchActionProps,
} from "../workbench-action/index.js";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { initMenuItemAndMatchCurrentPathKeys } from "@next-shared/general/menu";
import {
  SidebarMenuSimpleItem,
  SidebarMenuItem,
} from "@next-shared/general/types";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";
import styleText from "./workbench-action-list.shadow.css";

export interface SidebarMenu {
  title?: string;
  icon?: GeneralIconProps;
  menuItems?: SidebarMenuItem[];
}

const WrapperWorkbenchAction = wrapBrick<WorkbenchAction, WorkbenchActionProps>(
  "visual-builder.workbench-action"
);

const { defineElement, property } = createDecorators();

interface WorkbenchActionListProps {
  appId?: string;
  menu: SidebarMenu;
}

/**
 * @insider
 */
@defineElement("visual-builder.workbench-action-list", {
  styleTexts: [styleText],
})
class WorkbenchActionList extends ReactNextElement {
  @property() accessor appId: string | undefined;

  @property({
    attribute: false,
  })
  accessor menu!: SidebarMenu;

  render(): React.ReactNode {
    return <WorkbenchActionListComponent appId={this.appId} menu={this.menu} />;
  }
}

let currentAppId: string;
const historyMap = new Map<number, string>();

export function WorkbenchActionListComponent({
  appId,
  menu,
}: WorkbenchActionListProps) {
  const history = getHistory();
  const [activeIndex, setActiveIndex] = useState<number>();
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setLocation(location);
    });
    return unlisten;
  }, [history]);

  useEffect(() => {
    if (!currentAppId) currentAppId = appId;
    if (currentAppId !== appId) {
      historyMap.clear();
      currentAppId = appId;
    }
  }, [appId]);

  useEffect(() => {
    const { pathname, search } = location;

    const { selectedKeys } = initMenuItemAndMatchCurrentPathKeys(
      menu?.menuItems ?? [],
      pathname,
      search,
      ""
    );
    setActiveIndex(Number(selectedKeys[0]));
  }, [menu, location]);

  const handleLinkClick = (item: SidebarMenuItem): void => {
    if ((item as SidebarMenuSimpleItem).href) return;
    historyMap.set(activeIndex, `${location.pathname}${location.search}`);
  };

  const isSimpleMenuItem = (
    item: SidebarMenuItem
  ): item is SidebarMenuSimpleItem => {
    return item.type === "default" || !item.type;
  };

  return (
    <div className="workBenchActionList">
      {menu?.menuItems
        ?.map((item, index) => {
          if (isSimpleMenuItem(item)) {
            let url = item.to;
            if (activeIndex !== index && historyMap.has(index)) {
              url = historyMap.get(index);
            }
            return (
              <WrapperWorkbenchAction
                key={index}
                icon={item.icon}
                to={url as string}
                href={item.href}
                target={item.target}
                active={activeIndex === index}
                onClick={() => handleLinkClick(item)}
              />
            );
          }
        })
        .filter(Boolean)}
    </div>
  );
}

export { WorkbenchActionList };
