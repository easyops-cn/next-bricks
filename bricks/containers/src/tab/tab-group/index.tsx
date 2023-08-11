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
  showCard?: boolean;
  callback?: (element: HTMLDivElement) => void;
}

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
   * @default
   * @required
   * @description 样式类型
   */
  @property()
  accessor type: TabType = "default";

  /**
   * @default true
   * @required false
   * @description 是否展示背景
   */
  @property()
  accessor activePanel: string | undefined;

  /**
   * @default true
   * @required false
   * @description 是否展示背景
   */
  @property({
    type: Boolean,
  })
  accessor showCard: boolean | undefined;

  render() {
    return (
      <TabGroupElement
        type={this.type}
        activePanel={this.activePanel}
        showCard={this.showCard}
      />
    );
  }
}

function TabGroupElement({
  type,
  showCard = true,
  activePanel,
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

  const handleSetAcitve = useCallback((e: MouseEvent) => {
    setActiveItem((e.target as TabItem).panel);
  }, []);

  useEffect(() => {
    const navSlot = navSlotRef.current;
    initSetTab();

    navSlot.addEventListener("click", handleSetAcitve);
    navSlot.addEventListener("slotchange", initSetTab);
    return () => {
      navSlot.removeEventListener("click", handleSetAcitve);
      navSlot.removeEventListener("slotchange", initSetTab);
    };
  }, [activePanel, handleSetAcitve]);

  useEffect(() => {
    if (tabs.length) {
      setActiveItem(activePanel ?? tabs[0]);
    }
  }, [activePanel, tabs]);

  return (
    <div
      className={classNames("tab-wrapper", {
        "show-card": showCard,
      })}
    >
      <div className={classNames("tab-nav", type)}>
        <div className="tab-item-wrapper">
          <slot name="nav" ref={navSlotRef} />
        </div>
        <div className="extra">
          <slot name="extra" />
        </div>
      </div>
      <div className="content" ref={contentRef}>
        {tabs?.map((tab) => (
          <slot key={tab} name={tab} />
        ))}
      </div>
    </div>
  );
}

export { TabGroup };
