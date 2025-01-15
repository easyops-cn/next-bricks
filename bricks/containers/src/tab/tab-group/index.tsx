import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./tab.shadow.css";
import type { TabItem } from "../tab-item/index.js";
import type { TabType } from "../../interface.js";
import "./host-context.css";

const { defineElement, property, event } = createDecorators();

export interface TabGroupProps {
  type?: TabType;
  activePanel?: string;
  callback?: (element: HTMLDivElement) => void;
  outline?: TabsOutline;
  contentStyle?: React.CSSProperties;
  fillContainer?: boolean;
}

// Tabs 对轮廓暂只支持阴影或无轮廓，不支持边框或填充色。
export type TabsOutline =
  // | "border"
  | "shadow"
  // | "background"
  | "none"
  | "default";

export interface TabGroupEvents {
  "tab.select": CustomEvent<string>;
}

export interface TabGroupEventsMapping {
  onTabSelect: "tab.select";
}

/**
 * Tab 容器组
 * @author sailorshe
 * @insider
 */
@defineElement("eo-tab-group", {
  styleTexts: [styleText],
  alias: ["containers.tab-group"],
})
class TabGroup extends ReactNextElement implements TabGroupProps {
  /**
   * 样式类型
   * @default "default"
   */
  @property()
  accessor type: TabType | undefined;

  /**
   * 是否展示背景
   */
  @property()
  accessor activePanel: string | undefined;

  /**
   * 内容样式
   * */
  @property({ attribute: false })
  accessor contentStyle: React.CSSProperties | undefined;

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

  /**
   * 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。
   *
   * 该属性对 panel 类型无效（其始终无轮廓）。
   *
   * @default "default"
   */
  @property()
  accessor outline: TabsOutline | undefined;

  @property({ type: Boolean, render: false })
  accessor fillContainer: boolean | undefined;

  render() {
    return (
      <TabGroupElement
        type={this.type}
        activePanel={this.activePanel}
        contentStyle={this.contentStyle}
        onTabSelect={this.#handleTabSelect}
      />
    );
  }
}

interface TabGroupElementProps extends TabGroupProps {
  onTabSelect?: (panel: string) => void;
}

function TabGroupElement({
  activePanel,
  contentStyle,
  onTabSelect,
}: TabGroupElementProps): React.ReactElement {
  const navSlotRef = useRef<HTMLSlotElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<string[]>([]);

  const setActiveItem = (key: string): void => {
    const navSlot = navSlotRef.current;
    const contentSlot = contentRef.current;
    const navSlotChildren = navSlot.assignedElements()[0]
      ?.childNodes as unknown as TabItem[];
    const slotElement = contentSlot.querySelectorAll("slot");
    slotElement?.forEach((slot) => {
      if (slot.name === key) {
        slot.hidden = false;
      } else {
        slot.hidden = true;
      }
    });

    navSlotChildren?.forEach((item) => {
      if (item.panel === key) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  };

  useLayoutEffect(() => {
    const handleSetActive = (e: MouseEvent) => {
      const panel = (e.target as TabItem).panel;
      if (panel) {
        setActiveItem(panel);
        onTabSelect?.(panel);
      }
    };

    const initSetTab = () => {
      const navSlot = navSlotRef.current;
      const navSlotChildren = navSlot.assignedElements()[0]
        ?.childNodes as unknown as TabItem[];
      navSlotChildren?.length > 0 &&
        setTabs(() => {
          const tabs: string[] = [];
          navSlotChildren.forEach((item) => tabs.push(item.panel));
          return tabs;
        });
    };

    const navSlot = navSlotRef.current;
    initSetTab();

    navSlot.addEventListener("click", handleSetActive);
    navSlot.addEventListener("slotchange", initSetTab);
    return () => {
      navSlot.removeEventListener("click", handleSetActive);
      navSlot.removeEventListener("slotchange", initSetTab);
    };
  }, [onTabSelect]);

  useEffect(() => {
    if (tabs.length) {
      setActiveItem(activePanel ?? tabs[0]);
    }
  }, [activePanel, tabs]);

  return (
    <div className="tab-wrapper">
      <div className="tab-nav">
        <div className="tab-item-wrapper">
          <slot name="nav" ref={navSlotRef} />
        </div>
        <div className="extra">
          <slot name="extra" />
        </div>
      </div>
      <div className="content" ref={contentRef} style={contentStyle}>
        {tabs?.map((tab) => <slot key={tab} name={tab} />)}
      </div>
    </div>
  );
}

export { TabGroup };
