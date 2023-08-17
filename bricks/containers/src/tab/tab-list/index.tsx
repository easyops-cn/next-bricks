import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { TabGroup, TabGroupProps } from "../tab-group/index.js";
import type { TabItem, TabItemProps } from "../tab-item/index.js";
import { TabType } from "../../interface.js";

const { defineElement, property } = createDecorators();

const WrappedTabGroup = wrapBrick<TabGroup, TabGroupProps>("eo-tab-group");

const WrappedTabItem = wrapBrick<TabItem, TabItemProps>("eo-tab-item");

interface TabListProps {
  type?: TabType;
  tabs?: TabItemProps[];
  activePanel?: string;
  showCard?: boolean;
  panelStyle?: React.CSSProperties;
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
   * @default
   * @required
   * @description 样式类型
   */
  @property()
  accessor type: TabType = "default";

  /**
   * @default -
   * @required false
   * @description 标签页列表
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
   * 是否展示背景
   */
  @property({
    type: Boolean,
  })
  accessor showCard: boolean | undefined;

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
        showCard={this.showCard}
        panelStyle={this.panelStyle}
      />
    );
  }
}

function TabListElement({
  type,
  tabs,
  activePanel,
  showCard,
  panelStyle,
}: TabListProps): React.ReactElement {
  return (
    <WrappedTabGroup
      type={type}
      showCard={showCard}
      activePanel={activePanel}
      panelStyle={panelStyle}
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
