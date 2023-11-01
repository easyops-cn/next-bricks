import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  TabGroup,
  TabGroupProps,
  TabsOutline,
} from "../tab-group/index.js";
import type { TabItem, TabItemProps } from "../tab-item/index.js";
import { TabType } from "../../interface.js";

const { defineElement, property } = createDecorators();

const WrappedTabGroup = wrapBrick<TabGroup, TabGroupProps>("eo-tab-group");

const WrappedTabItem = wrapBrick<TabItem, TabItemProps>("eo-tab-item");

interface TabListProps {
  type?: TabType;
  tabs?: TabItemProps[];
  activePanel?: string;
  panelStyle?: React.CSSProperties;
  outline?: TabsOutline;
}

/**
 * Tab 列表
 * @author sailorshe
 * @slot extra - 头部插槽
 * @slot [panel] - Tab 页插槽
 */
@defineElement("eo-tab-list", {
  alias: ["containers.tab-list"],
})
class TabList extends ReactNextElement {
  /**
   * 样式类型
   * @default "default"
   */
  @property()
  accessor type: TabType = "default";

  /**
   * 标签页列表
   */
  @property({
    attribute: false,
  })
  accessor tabs: Array<TabItemProps | string> | undefined;

  /**
   * 头部样式
   */
  @property({
    attribute: false,
  })
  accessor panelStyle: React.CSSProperties;

  /**
   * 激活状态 tab 的 panel
   */
  @property()
  accessor activePanel: string | undefined;

  /**
   * 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。
   *
   * @default "default"
   */
  @property()
  accessor outline: TabsOutline | undefined;

  #computedTabs = (tabs: Array<TabItemProps | string>): TabItemProps[] => {
    if (tabs?.length) {
      return tabs.map((tab) => {
        if (typeof tab === "string" || typeof tab === "number") {
          return {
            text: tab,
            panel: tab,
          };
        }
        return tab;
      });
    }
    return [];
  };

  render() {
    return (
      <TabListElement
        type={this.type}
        tabs={this.#computedTabs(this.tabs)}
        activePanel={this.activePanel}
        panelStyle={this.panelStyle}
        outline={this.outline}
      />
    );
  }
}

function TabListElement({
  type,
  tabs,
  activePanel,
  panelStyle,
  outline,
}: TabListProps): React.ReactElement {
  return (
    <WrappedTabGroup
      type={type}
      activePanel={activePanel}
      panelStyle={panelStyle}
      outline={outline}
    >
      {tabs.map((tab) => (
        <WrappedTabItem
          type={type}
          slot="nav"
          key={tab.panel}
          active={activePanel === tab.panel}
          {...tab}
        >
          {tab.text}
        </WrappedTabItem>
      ))}
      <slot name="extra" slot="extra" />
      {tabs?.map((tab) => (
        <slot key={tab.panel} name={tab.panel} slot={tab.panel} />
      ))}
    </WrappedTabGroup>
  );
}

export { TabList };
