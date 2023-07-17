import React, { useEffect, useRef, useState, useCallback } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { TriggerEvent } from "../interface.js";
import {
  ARROW_SIZE,
  POPUP_DISTANCE,
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
}

export interface PopoverEvents {
  "visible.change": CustomEvent<boolean>;
  "before.visible.change": CustomEvent<boolean>;
}
export interface PopoverEventsMapping {
  onVisibleChange: "visible.change";
  beforeVisibleChange: "before.visible.change";
}

/**
 * 通用弹出层构件
 * @author sailor
 *
 * @slot - 弹出层内容
 * @slot anchor - 触发弹出层的元素
 */
@defineElement("eo-popover", {
  styleTexts: [styleText],
  alias: ["basic.general-popover"],
})
class Popover extends ReactNextElement implements PopoverProps {
  /**
   * 弹出层放置位置
   */
  @property()
  accessor placement: Placement | undefined;

  /**
   * 弹出触发方式
   * @default "click"
   */
  @property()
  accessor trigger: TriggerEvent | undefined;

  /**
   * 弹出层是否已激活
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  /**
   * 弹出层是否显示箭头
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor arrow: boolean | undefined;

  /**
   * 弹出层如何定位
   * @default "absolute"
   */
  @property()
  accessor strategy: "absolute" | "fixed" | undefined;

  /**
   * 将弹出层的宽高与 anchor 元素同步
   */
  @property()
  accessor sync: Sync | undefined;

  /**
   * 当弹出层可见性变化之后触发
   * @detail 当前是否可见
   */
  @event({ type: "visible.change" })
  accessor #visibleChangeEvent!: EventEmitter<boolean>;

  #handleVisibleChange = (visible: boolean): void => {
    this.#visibleChangeEvent.emit(visible);
  };

  /**
   * 当弹出层可见性变化时触发
   * @detail 当前是否可见
   */
  @event({ type: "before.visible.change" })
  accessor #beforeVisibleChangeEvent!: EventEmitter<boolean>;
  #handleBeforeVisibleChange = (visible: boolean): void => {
    this.#beforeVisibleChangeEvent.emit(visible);
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
        onVisibleChange={this.#handleVisibleChange}
        beforeVisibleChange={this.#handleBeforeVisibleChange}
      />
    );
  }
}

interface PopoverComponentProps extends PopoverProps {
  onVisibleChange?: (visible: boolean) => void;
  beforeVisibleChange?: (visible: boolean) => void;
}

function PopoverComponent(props: PopoverComponentProps) {
  const {
    curElement,
    active = false,
    trigger,
    onVisibleChange,
    beforeVisibleChange,
  } = props;
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
      beforeVisibleChange?.(visible);
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
    [beforeVisibleChange, onVisibleChange]
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
  const handlePopoverClose = useCallback(() => {
    handleVisibleChange(false);
  }, [handleVisibleChange]);

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
      curElement?.addEventListener("mouseleave", handlePopoverClose);
      document?.addEventListener("click", handlePopoverClose);

      return () => {
        triggerSlot?.removeEventListener("mouseover", handlePopoverOpen);
        curElement?.removeEventListener("mouseleave", handlePopoverClose);
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
    curElement,
  ]);

  return (
    <WrappedSlPopup
      ref={popoverRef}
      {...omit(props, ["curElement", "onVisibleChange"])}
      shift
      distance={props.arrow ? POPUP_DISTANCE + ARROW_SIZE : POPUP_DISTANCE}
    >
      <slot
        name="anchor"
        slot="anchor"
        ref={triggerRef}
        style={{
          padding: props.arrow ? POPUP_DISTANCE + ARROW_SIZE : POPUP_DISTANCE,
          margin: -(props.arrow ? POPUP_DISTANCE + ARROW_SIZE : POPUP_DISTANCE),
          display: "inline-block",
        }}
      ></slot>
      <slot ref={defaultRef} hidden={!visible}></slot>
    </WrappedSlPopup>
  );
}

export { Popover };
