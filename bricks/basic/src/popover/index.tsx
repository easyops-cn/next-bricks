import React, { useEffect, useRef, useState, useCallback } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { TriggerEvent } from "../interface.js";
import {
  Placement,
  SlPopupElement,
  SlPopupProps,
  Sync,
  WrappedSlPopup,
} from "./popup.js";
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
        trigger={this.trigger ?? "click"}
        placement={this.placement ?? "bottom"}
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
  const { curElement, active = false, trigger, onVisibleChange } = props;
  const popoverRef = useRef<SlPopupElement>(null);
  const defaultRef = useRef<HTMLSlotElement>(null);
  const triggerRef = useRef<HTMLSlotElement>(null);
  const [visible, setVisible] = useState(active);

  const runAnimate = async (
    element: HTMLElement,
    keyframes: Keyframe[],
    options?: KeyframeAnimationOptions
  ) => {
    return new Promise((resolve) => {
      const animation = element.animate(keyframes, {
        ...options,
        duration: options!.duration,
      });

      animation.addEventListener("cancel", resolve, { once: true });
      animation.addEventListener("finish", resolve, { once: true });
    });
  };

  const handleVisibleChange = useCallback(
    async (visible: boolean): Promise<void> => {
      const popover = popoverRef.current;
      if (popover) {
        visible && setVisible(visible);
        visible && (popover.active = visible);

        popover.popup &&
          (await runAnimate(
            popover.popup,
            visible
              ? [
                  {
                    opacity: 0,
                    scale: 0.9,
                  },
                  {
                    opacity: 1,
                    scale: 1,
                  },
                ]
              : [
                  {
                    opacity: 1,
                    scale: 1,
                  },
                  {
                    opacity: 0,
                    scale: 0.9,
                  },
                ],
            { duration: 300, easing: "ease" }
          ));

        !visible && (popover.active = visible);
        !visible && setVisible(visible);
      }

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
    handleVisibleChange(!visible);
  }, [visible, handleVisibleChange]);

  const handlePopoverOpen = useCallback(
    () => !visible && handleVisibleChange(true),
    [visible, handleVisibleChange]
  );
  const handlePopoverClose = () => handleVisibleChange(false);

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
      triggerSlot?.addEventListener("mouseleave", handleAutoDropdownClose);
      document?.addEventListener("mouseover", handleAutoDropdownClose);
      document?.addEventListener("click", handlePopoverClose);

      return () => {
        triggerSlot?.removeEventListener("mouseover", handlePopoverOpen);
        triggerSlot?.removeEventListener("mouseleave", handleAutoDropdownClose);
        document?.removeEventListener("mouseover", handleAutoDropdownClose);
        document?.removeEventListener("click", handlePopoverClose);
      };
    }
  }, [
    handleAutoDropdownClose,
    handlePopoverClose,
    handlePopoverOpen,
    handleTriggerClick,
    trigger,
    visible,
  ]);

  return (
    <WrappedSlPopup
      ref={popoverRef}
      {...omit(props, ["curElement", "onVisibleChange"])}
    >
      <slot part="anchor" name="anchor" slot="anchor" ref={triggerRef}></slot>
      <slot part="panel" ref={defaultRef} hidden={!visible}></slot>
    </WrappedSlPopup>
  );
}

export { Popover };
