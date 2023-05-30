import React, { useEffect, useRef, useState, useCallback } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { TriggerEvent } from "../interface.js";
import { Placement, SlPopupProps, Sync, WrappedSlPopup } from "./popup.js";
import { omit } from "lodash";
import styleText from "./popover.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface PopoverProps extends SlPopupProps {
  curElement?: HTMLElement;
  trigger?: TriggerEvent;
  onVisibleChange?: (visible: boolean) => void;
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
class Popover extends ReactNextElement implements PopoverProps {
  /**
   * @default
   * @required
   * @description
   */
  @property()
  accessor placement: Placement | undefined;

  /**
   * @default click
   * @required false
   * @description 触发方式
   */
  @property()
  accessor trigger: TriggerEvent | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    type: Boolean,
  })
  accessor arrow: boolean | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property()
  accessor strategy: "absolute" | "fixed" | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property()
  accessor sync: Sync | undefined;

  /**
   * @detail
   * @description
   */
  @event({ type: "visible.change" })
  accessor #visibleChangeEvent!: EventEmitter<boolean>;

  handleVisibleChange = (visible: boolean): void => {
    this.#visibleChangeEvent.emit(visible);
  };

  render() {
    return (
      <PopoverComponent
        curElement={this}
        trigger={this.trigger}
        placement={this.placement}
        arrow={this.arrow}
        strategy={this.strategy}
        sync={this.sync}
        active={this.active}
        onVisibleChange={this.handleVisibleChange}
      />
    );
  }
}

function PopoverComponent(props: PopoverProps) {
  const {
    curElement,
    active = false,
    trigger = "click",
    onVisibleChange,
  } = props;
  const defaultRef = useRef<HTMLSlotElement>(null);
  const triggerRef = useRef<HTMLSlotElement>(null);
  const [visible, setVisible] = useState(active);
  const handleVisibleChange = useCallback(
    (visible: boolean): void => {
      setVisible(visible);
      onVisibleChange?.(visible);
    },
    [onVisibleChange]
  );

  const handleAutoDropdownClose = useCallback(
    (e: MouseEvent) => {
      if (visible && curElement) {
        const path = e.composedPath();
        if (!path.includes(curElement)) {
          handleVisibleChange(false);
        }
      }
    },
    [curElement, visible, handleVisibleChange]
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

      return () => {
        triggerSlot?.removeEventListener("mouseover", handlePopoverOpen);
        document?.removeEventListener("mouseover", handleAutoDropdownClose);
      };
    }
  }, [
    handleAutoDropdownClose,
    handlePopoverOpen,
    handleTriggerClick,
    trigger,
    visible,
  ]);

  return (
    <WrappedSlPopup
      className="popup"
      placement="bottom"
      trigger="click"
      {...omit(props, ["curElement", "onVisibleChange"])}
      active={visible}
    >
      <slot name="anchor" slot="anchor" ref={triggerRef}></slot>
      <slot ref={defaultRef}></slot>
    </WrappedSlPopup>
  );
}

export { Popover };
