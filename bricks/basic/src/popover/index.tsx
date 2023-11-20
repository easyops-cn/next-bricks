import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  CSSProperties,
} from "react";
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
  popupAnimationOptions,
  popupInvisibleStyle,
  popupVisibleStyle,
} from "./popup.js";
import { omit } from "lodash";
import styleText from "./popover.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface PopoverProps extends SlPopupProps {
  curElement?: HTMLElement;
  trigger?: TriggerEvent;
  disabled?: boolean;
  arrowColor?: string;
  anchorDisplay?: CSSProperties["display"];
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
 *
 * @part popup - The popup’s container. Useful for setting a background color, box shadow, etc.
 *
 * @category container-display
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
   * 箭头颜色
   */
  @property()
  accessor arrowColor: string | undefined;

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
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 弹出窗口与其锚点之间的距离
   */
  @property()
  accessor distance: number | undefined;

  /**
   * 触发器的显示类型
   * @default "inline-block"
   */
  @property()
  accessor anchorDisplay: CSSProperties["display"];

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
    this.active = visible;
    this.#beforeVisibleChangeEvent.emit(visible);
  };

  render() {
    return (
      <PopoverComponent
        curElement={this}
        trigger={this.trigger ?? "click"}
        placement={this.placement ?? "bottom"}
        arrow={this.arrow}
        arrowColor={this.arrowColor}
        strategy={this.strategy}
        sync={this.sync}
        active={this.active}
        disabled={this.disabled}
        onVisibleChange={this.#handleVisibleChange}
        beforeVisibleChange={this.#handleBeforeVisibleChange}
        distance={this.distance}
        anchorDisplay={this.anchorDisplay}
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
    disabled,
    trigger,
    arrowColor,
    onVisibleChange,
    beforeVisibleChange,
    distance = props.arrow ? POPUP_DISTANCE + ARROW_SIZE : POPUP_DISTANCE,
    anchorDisplay = "inline-block",
  } = props;
  const firstRendered = useRef(true);
  const popoverRef = useRef<SlPopupElement>(null);
  const defaultRef = useRef<HTMLSlotElement>(null);
  const triggerRef = useRef<HTMLSlotElement>(null);
  const popupAnimation = useRef<Animation | null>(null);
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    setVisible(active);
  }, [active]);

  const handleVisibleChange = useCallback(
    async (
      visible: boolean,
      options: { triggerEvent?: boolean; runAnimation?: boolean }
    ): Promise<void> => {
      const { triggerEvent, runAnimation } = options;
      const popover = popoverRef.current;
      const body = defaultRef.current;

      if (popover?.popup && body) {
        triggerEvent && beforeVisibleChange?.(visible);

        if (!runAnimation) {
          if (popupAnimation.current) {
            popupAnimation.current.cancel();
            popupAnimation.current = null;
          }
          if (visible) {
            body.hidden = false;
            popover.active = true;
            for (const key in popupVisibleStyle) {
              popover.popup.style[key as any] = popupVisibleStyle[key];
            }
          } else {
            popover.active = false;
            body.hidden = true;
            for (const key in popupInvisibleStyle) {
              popover.popup.style[key as any] = popupVisibleStyle[key];
            }
          }
          triggerEvent && onVisibleChange?.(visible);
        } else {
          if (visible) {
            const callback = () => {
              popupAnimation.current = null;
              triggerEvent && onVisibleChange?.(visible);
            };

            if (popupAnimation.current) {
              popupAnimation.current.reverse();
              popupAnimation.current.onfinish = callback;
            } else {
              body.hidden = false;
              popover.active = true;
              const animation = popover.popup.animate(
                [popupInvisibleStyle, popupVisibleStyle],
                popupAnimationOptions as KeyframeAnimationOptions
              );
              animation.onfinish = callback;
              popupAnimation.current = animation;
            }
          } else {
            const callback = () => {
              popupAnimation.current = null;
              popover.active = false;
              body.hidden = true;
              triggerEvent && onVisibleChange?.(visible);
            };

            if (popupAnimation.current) {
              popupAnimation.current.reverse();
              popupAnimation.current.onfinish = callback;
            } else {
              const animation = popover.popup.animate(
                [popupVisibleStyle, popupInvisibleStyle],
                popupAnimationOptions as KeyframeAnimationOptions
              );
              animation.onfinish = callback;
              popupAnimation.current = animation;
            }
          }
        }
      }
    },
    [beforeVisibleChange, onVisibleChange]
  );

  useEffect(() => {
    handleVisibleChange(visible, {
      triggerEvent: !firstRendered.current,
      runAnimation: !firstRendered.current,
    });
    firstRendered.current = false;
  }, [visible]);

  const handleAutoDropdownClose = useCallback(
    (e: MouseEvent) => {
      if (curElement) {
        const path = e.composedPath();
        if (!path.includes(curElement)) {
          setVisible(false);
        }
      }
    },
    [curElement]
  );

  const handleTriggerClick = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  const handlePopoverOpen = useCallback(() => setVisible(true), []);

  const handlePopoverClose = useCallback(() => setVisible(false), []);

  const handleNotTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    disabled && setVisible(false);
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;
    const triggerSlot = triggerRef.current;
    const defaultSlot = defaultRef.current;

    if (trigger === "click") {
      triggerSlot?.addEventListener("click", handleTriggerClick);
      document.addEventListener("click", handleAutoDropdownClose);

      return () => {
        triggerSlot?.removeEventListener("click", handleTriggerClick);
        document.removeEventListener("click", handleAutoDropdownClose);
      };
    } else if (trigger === "hover") {
      triggerSlot?.addEventListener("mouseover", handlePopoverOpen);
      curElement?.addEventListener("mouseleave", handlePopoverClose);
      defaultSlot?.addEventListener("click", handleNotTrigger);
      triggerSlot?.addEventListener("click", handleNotTrigger);
      document?.addEventListener("click", handlePopoverClose);

      return () => {
        triggerSlot?.removeEventListener("mouseover", handlePopoverOpen);
        curElement?.removeEventListener("mouseleave", handlePopoverClose);
        defaultSlot?.removeEventListener("click", handleNotTrigger);
        triggerSlot?.removeEventListener("click", handleNotTrigger);
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
    disabled,
  ]);

  useEffect(() => {
    if (popoverRef.current && arrowColor) {
      popoverRef.current.style.setProperty("--arrow-color", arrowColor);
    }
  }, [arrowColor]);

  return (
    <WrappedSlPopup
      exportparts="popup"
      ref={popoverRef}
      {...omit(props, ["active", "curElement", "onVisibleChange"])}
      shift
      shiftPadding={24}
      distance={distance}
    >
      <slot
        name="anchor"
        slot="anchor"
        ref={triggerRef}
        style={{
          padding: props.arrow ? POPUP_DISTANCE + ARROW_SIZE : POPUP_DISTANCE,
          margin: -(props.arrow ? POPUP_DISTANCE + ARROW_SIZE : POPUP_DISTANCE),
          display: anchorDisplay,
        }}
      />
      <slot ref={defaultRef} />
    </WrappedSlPopup>
  );
}

export { Popover, Placement };
