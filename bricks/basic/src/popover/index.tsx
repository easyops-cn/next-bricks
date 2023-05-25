import React, { useEffect, useRef, useState, useCallback } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./popover.shadow.css";
import classNames from "classnames";
import { PlaceMent, TriggerEvent } from "../interface.js";

const { defineElement, property } = createDecorators();

export interface DropdownProps {
  curElement: HTMLElement;
  trigger?: TriggerEvent;
  placement?: PlaceMent;
}
/**
 * @id basic.general-popover
 * @name basic.general-popover
 * @docKind brick
 * @description 弹出层构件
 * @author sailor
 *
 */
@defineElement("basic.general-popover", {
  styleTexts: [styleText],
})
class Popover extends ReactNextElement {
  /**
   * @default
   * @required
   * @description
   */
  @property()
  accessor placement: PlaceMent | undefined;

  /**
   * @default click
   * @required false
   * @description 触发方式
   */
  @property()
  accessor trigger: TriggerEvent | undefined;

  render() {
    return (
      <PopoverComponent
        curElement={this}
        trigger={this.trigger}
        placement={this.placement}
      />
    );
  }
}

function PopoverComponent({
  curElement,
  trigger = "click",
  placement = "bottom",
}: DropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const defaultRef = useRef<HTMLSlotElement>(null);
  const triggerRef = useRef<HTMLSlotElement>(null);
  const [visible, setVisible] = useState(false);
  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({});

  const handleAutoDropdownClose = useCallback(
    (e: MouseEvent) => {
      if (visible) {
        const path = e.composedPath();
        if (!path.includes(curElement)) {
          setVisible(false);
        }
      }
    },
    [curElement, visible]
  );

  const handleTriggerClick = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const handlePopoverOpen = useCallback(
    () => !visible && setVisible(true),
    [visible]
  );
  const handlePopoverClose = () => setVisible(false);

  useEffect(() => {
    const triggerSlot = triggerRef.current;
    const defaultSlot = defaultRef.current;

    if (trigger === "click") {
      triggerSlot?.addEventListener("click", handleTriggerClick);
      defaultSlot?.addEventListener("click", handlePopoverClose);
      document.addEventListener("click", handleAutoDropdownClose);

      return () => {
        triggerSlot?.removeEventListener("click", handleTriggerClick);
        defaultSlot?.addEventListener("click", handlePopoverClose);
        document.removeEventListener("click", handleAutoDropdownClose);
      };
    } else if (trigger === "hover") {
      triggerSlot?.addEventListener("mouseover", handlePopoverOpen);
      document?.addEventListener("mouseover", handleAutoDropdownClose);
      document.addEventListener("click", handleAutoDropdownClose);

      return () => {
        triggerSlot?.removeEventListener("mouseover", handlePopoverOpen);
        document?.removeEventListener("mouseover", handleAutoDropdownClose);
        document.removeEventListener("click", handleAutoDropdownClose);
      };
    }
  }, [
    handleAutoDropdownClose,
    handlePopoverOpen,
    handleTriggerClick,
    trigger,
    visible,
  ]);

  useEffect(() => {
    const wrapperDOM = wrapperRef.current;
    const contentDOM = contentRef.current;

    const wrapper = wrapperDOM?.getBoundingClientRect();
    const content = contentDOM?.getBoundingClientRect();

    if (visible && wrapper && content) {
      const {
        width: wrapperWidth,
        height: wrapperHeight,
        x: wrapperX,
        y: wrapperY,
      } = wrapper;
      const { width: contentWidth, height: contentHeight } = content;
      const defaultMargin = 4;

      let x = 0,
        y = 0;
      switch (placement) {
        case "top": {
          (x = wrapperX), (y = wrapperY - contentHeight - defaultMargin);
          break;
        }
        case "bottom": {
          (x = wrapperX), (y = wrapperY + wrapperHeight + defaultMargin);
          break;
        }
        case "right": {
          (x = wrapperX + wrapperWidth + defaultMargin), (y = wrapperY);
          break;
        }
        case "left": {
          (x = wrapperX - contentWidth - defaultMargin), (y = wrapperY);
          break;
        }
      }

      setContentStyle({
        top: y,
        left: x,
      });
    }
  }, [placement, visible]);

  return (
    <div className="popover-wrapper" ref={wrapperRef}>
      <slot name="trigger" ref={triggerRef}></slot>
      <div
        ref={contentRef}
        className={classNames("popover-content", visible ? "open" : "close")}
        style={contentStyle}
      >
        <slot className="default-slot" ref={defaultRef}></slot>
      </div>
    </div>
  );
}

export { Popover };
