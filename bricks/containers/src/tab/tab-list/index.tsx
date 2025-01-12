import React, { useCallback, useEffect, useMemo, useRef } from "react";
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
  tabs?: (TabItemProps | string)[];
  activePanel?: string;
  outline?: TabsOutline;
  autoPlay?: boolean;
  autoSpeed?: number;
  fillContainer?: boolean;
  contentStyle?: React.CSSProperties;
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
class TabList extends ReactNextElement implements TabListProps {
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
  accessor tabs: (TabItemProps | string)[] | undefined;

  /**
   * 激活状态 tab 的 panel
   */
  @property()
  accessor activePanel: string | undefined;

  /**
   * 内容样式
   * */
  @property({ attribute: false })
  accessor contentStyle: React.CSSProperties | undefined;

  /**
   * 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。
   *
   * 该属性对 panel 类型无效（其始终无轮廓）。
   *
   * @default "default"
   */
  @property()
  accessor outline: TabsOutline | undefined;

  /**
   * 是否开启标签内容自动轮播
   * @default false
   * */
  @property({
    type: Boolean,
  })
  accessor autoPlay: boolean | undefined;

  /**
   * 轮播的时间间隔，单位 ms
   * @default 3000
   * */
  @property({
    type: Number,
  })
  accessor autoSpeed: number = 3000;

  @property({ type: Boolean })
  accessor fillContainer: boolean | undefined;

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
        tabs={this.tabs}
        activePanel={this.activePanel}
        outline={this.outline}
        contentStyle={this.contentStyle}
        autoPlay={this.autoPlay}
        autoSpeed={this.autoSpeed}
        fillContainer={this.fillContainer}
        onTabSelect={this.#handleTabSelect}
      />
    );
  }
}

interface TabListElementProps extends TabListProps {
  onTabSelect?: (panel: string) => void;
}

interface TabNode extends TabItemProps {
  next: string;
}

function getTabPlayQueue(tabs: TabItemProps[]) {
  const map = new Map<string, TabNode>();
  const filters = tabs?.filter((item) => !item.hidden && !item.disabled);

  filters?.forEach((item, index) => {
    const nextItem =
      index === filters.length - 1 ? filters[0] : filters[index + 1];
    map.set(item.panel, {
      ...item,
      next: nextItem.panel,
    });
  });
  return map;
}

function TabListElement({
  type,
  tabs: _tabs,
  activePanel,
  outline,
  contentStyle,
  onTabSelect,
  autoPlay,
  autoSpeed,
  fillContainer,
}: TabListElementProps): React.ReactElement {
  const timerRef = useRef<number>(undefined);

  const tabs = useMemo(() => {
    if (_tabs?.length) {
      return _tabs.map((tab) => {
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
  }, []);

  const tabItemMap = useMemo(() => getTabPlayQueue(tabs), [tabs]);

  const play = useCallback(() => {
    const activeKey = activePanel || tabs[0].panel;
    const nextKey = tabItemMap.get(activeKey)?.next;

    // istanbul ignore else
    if (nextKey && tabItemMap.size > 1) {
      onTabSelect(nextKey);
    }
  }, [activePanel, onTabSelect, tabItemMap, tabs]);

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = window.setInterval(play, autoSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [autoPlay, autoSpeed, play]);

  const handleSelect = (e: CustomEvent<string>) => {
    onTabSelect?.(e.detail);
    if (autoPlay && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = window.setInterval(play, autoSpeed);
    }
  };

  return (
    <WrappedTabGroup
      type={type}
      activePanel={activePanel}
      outline={outline}
      contentStyle={contentStyle}
      onTabSelect={handleSelect}
      fillContainer={fillContainer}
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
