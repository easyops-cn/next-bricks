import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./tab.shadow.css";
import classNames from "classnames";
import type { TabItem } from "../tab-item/index.js";
import { TabType } from "../../interface.js";

const { defineElement, property } = createDecorators();

export interface TabGroupProps {
  type?: TabType;
  activePanel?: string;
  callback?: (element: HTMLDivElement) => void;
  panelStyle?: React.CSSProperties;
  outline?: TabsOutline;
}

export type TabsOutline =
  // | "border"
  | "shadow"
  // | "background"
  | "none"
  | "default";

/**
 * Tab 容器组
 * @author sailorshe
 *
 */
@defineElement("eo-tab-group", {
  styleTexts: [styleText],
  alias: ["containers.tab-group"],
})
class TabGroup extends ReactNextElement {
  /**
   * 样式类型
   * @default "default"
   */
  @property()
  accessor type: TabType = "default";

  /**
   * 头部样式
   */
  @property({
    attribute: false,
  })
  accessor panelStyle: React.CSSProperties;

  /**
   * 是否展示背景
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

  render() {
    return (
      <TabGroupElement
        type={this.type}
        activePanel={this.activePanel}
        panelStyle={this.panelStyle}
      />
    );
  }
}

function TabGroupElement({
  type,
  activePanel,
  panelStyle,
}: TabGroupProps): React.ReactElement {
  const navSlotRef = useRef<HTMLSlotElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<string[]>([]);

  const setActiveItem = (key: string): void => {
    const navSlot = navSlotRef.current;
    const contentSlot = contentRef.current;
    const navSlotChildren = navSlot.assignedElements() as TabItem[];
    const slotElement = contentSlot.querySelectorAll("slot");
    slotElement?.forEach((slot) => {
      if (slot.name === key) {
        slot.hidden = false;
      } else {
        slot.hidden = true;
      }
    });

    navSlotChildren.forEach((item) => {
      if (item.panel === key) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  };

  const initSetTab = () => {
    const navSlot = navSlotRef.current;
    const navSlotChildren = navSlot.assignedElements() as TabItem[];
    navSlotChildren?.length > 0 &&
      setTabs(navSlotChildren.map((item) => item.panel));
  };

  const handleSetActive = useCallback((e: MouseEvent) => {
    setActiveItem((e.target as TabItem).panel);
  }, []);

  useEffect(() => {
    const navSlot = navSlotRef.current;
    initSetTab();

    navSlot.addEventListener("click", handleSetActive);
    navSlot.addEventListener("slotchange", initSetTab);
    return () => {
      navSlot.removeEventListener("click", handleSetActive);
      navSlot.removeEventListener("slotchange", initSetTab);
    };
  }, [activePanel, handleSetActive]);

  useEffect(() => {
    if (tabs.length) {
      setActiveItem(activePanel ?? tabs[0]);
    }
  }, [activePanel, tabs]);

  return (
    <div className="tab-wrapper">
      <div className={classNames("tab-nav", type)} style={panelStyle}>
        <div className="tab-item-wrapper">
          <slot name="nav" ref={navSlotRef} />
        </div>
        <div className="extra">
          <slot name="extra" />
        </div>
      </div>
      <div className="content" ref={contentRef}>
        {tabs?.map((tab) => <slot key={tab} name={tab} />)}
      </div>
    </div>
  );
}

export { TabGroup };
