import React from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  TabGroup,
  TabGroupEvents,
  TabGroupEventsMapping,
  TabGroupProps,
  TabsOutline,
} from "../tab-group/index.js";
import type { TabItem, TabItemProps } from "../tab-item/index.js";
import { TabType } from "../../interface.js";
import styleText from "./tab-list.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedTabGroup = wrapBrick<
  TabGroup,
  TabGroupProps,
  TabGroupEvents,
  TabGroupEventsMapping
>("eo-tab-group", {
  onTabSelect: "tab.select",
});

const WrappedTabItem = wrapBrick<TabItem, TabItemProps>("eo-tab-item");

interface TabListProps {
  type?: TabType;
  tabs?: TabItemProps[];
  activePanel?: string;
  outline?: TabsOutline;
}

export interface TabListEvents {
  "tab.select": CustomEvent<string>;
}

export interface TabListEventsMapping {
  onTabSelect: "tab.select";
}

/**
 * Tab 列表
 * @author sailorshe
 * @slot extra - 头部插槽
 * @slot [panel] - Tab 页插槽
 * @category container-display
 */
@defineElement("eo-tab-list", {
  alias: ["containers.tab-list"],
  styleTexts: [styleText],
})
class TabList extends ReactNextElement {
  /**
   * 样式类型
   * @default "default"
   */
  @property()
  accessor type: TabType | undefined;

  /**
   * 标签页列表
   */
  @property({
    attribute: false,
  })
  accessor tabs: Array<TabItemProps | string> | undefined;

  /**
   * 激活状态 tab 的 panel
   */
  @property()
  accessor activePanel: string | undefined;

  /**
   * 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。
   *
   * 该属性对 panel 类型无效（其始终无轮廓）。
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

  /**
   * 选择 tab 时触发
   * @detail panel
   */
  @event({ type: "tab.select" })
  accessor #tabSelectEvent!: EventEmitter<string>;

  #handleTabSelect = (panel: string): void => {
    this.activePanel = panel;
    this.#tabSelectEvent.emit(panel);
  };

  render() {
    return (
      <TabListElement
        type={this.type}
        tabs={this.#computedTabs(this.tabs)}
        activePanel={this.activePanel}
        outline={this.outline}
        onTabSelect={this.#handleTabSelect}
      />
    );
  }
}

interface TabListElementProps extends TabListProps {
  onTabSelect?: (panel: string) => void;
}

function TabListElement({
  type,
  tabs,
  activePanel,
  outline,
  onTabSelect,
}: TabListElementProps): React.ReactElement {
  return (
    <WrappedTabGroup
      type={type}
      activePanel={activePanel}
      outline={outline}
      onTabSelect={(e) => onTabSelect?.(e.detail)}
    >
      <div className="tabs-wrapper" slot="nav">
        {tabs.map((tab) => (
          <WrappedTabItem
            type={type}
            key={tab.panel}
            active={activePanel === tab.panel}
            {...tab}
          >
            {tab.text}
          </WrappedTabItem>
        ))}
      </div>
      <slot name="extra" slot="extra" />
      {tabs?.map((tab) => (
        <slot key={tab.panel} name={tab.panel} slot={tab.panel} />
      ))}
    </WrappedTabGroup>
  );
}

export { TabList };
