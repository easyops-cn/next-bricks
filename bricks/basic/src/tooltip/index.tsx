import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import {
  WrappedSlTooltip,
  SlTooltipProps,
  Placement,
  ARROW_SIZE,
  DISTANCE,
} from "./sl-tooltip.js";

const { defineElement, property, method, event } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface ToolTipProps
  extends Pick<
    SlTooltipProps,
    "content" | "placement" | "disabled" | "open" | "trigger" | "hoist"
  > {
  icon?: GeneralIconProps;
  maxWidth?: string;
}

export interface TooltipEvents {
  "open.change": CustomEvent<boolean>;
  "after.open.change": CustomEvent<boolean>;
}

export interface TooltipEventsMapping {
  onOpenChange: "open.change";
  onAfterOpenChange: "after.open.change";
}

/**
 * 文字提示构件，鼠标悬停或点击时显示提示气泡，支持多种弹出方向、图标模式、自定义内容插槽及手动控制显隐
 * @en A tooltip brick that shows a tip bubble on mouse hover or click, supporting multiple popup directions, icon mode, custom content slots and manual control of visibility
 *
 * @slot - 提示的目标元素
 * @slotEn - The target element of the tooltip
 * @slot content - 放置在提示中的元素
 * @slotEn content - The element placed in the tooltip
 *
 * @category feedback-and-tooltip
 */
export
@defineElement("eo-tooltip", {
  styleTexts: [styleText],
})
class EoTooltip extends ReactNextElement implements ToolTipProps {
  /**
   * 图标
   * @en Icon
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;
  /**
   * 内容
   * @en Content
   */
  @property()
  accessor content: string | undefined;

  /**
   * 弹出位置
   * @en Popup position
   */
  @property()
  accessor placement: Placement | undefined;

  /**
   * 是否禁用
   * @en Whether it is disabled
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined = false;

  /**
   * 是否显示
   * @en Whether to show
   */
  @property({ type: Boolean })
  accessor open: boolean | undefined;

  /**
   * 激活方式，包括 `click` | `hover` | `focus` | `manual`，可以多选用空格分隔
   * @en Trigger mode, including `click` | `hover` | `focus` | `manual`; multiple values can be separated by spaces
   */
  @property()
  accessor trigger: string | undefined;

  /**
   * 是否使用固定定位防止内容被裁切
   * @en Whether to use fixed positioning to prevent the content from being clipped
   */
  @property({ type: Boolean })
  accessor hoist: boolean | undefined;

  /**
   * 最大长度, 默认 250px
   * @en Maximum length, 250px by default
   */
  @property()
  accessor maxWidth: string | undefined = "250px";

  /**
   * 显示提示
   * @en Show the tooltip
   */
  @method()
  show(): void {
    this.open = true;
  }

  /**
   * 隐藏提示
   * @en Hide the tooltip
   */
  @method()
  hide(): void {
    this.open = false;
  }

  /**
   * 当提示可见性开始变化时触发
   * @en Triggered when the tooltip visibility starts to change
   * @detail 当前是否可见
   * @detailEn Whether it is currently visible
   */
  @event({ type: "open.change" })
  accessor #openChangeEvent!: EventEmitter<boolean>;
  #handleOpenChange = (open: boolean): void => {
    this.open = open;
    this.#openChangeEvent.emit(open);
  };

  /**
   * 当提示可见性变化完成并完成所有动画后触发。
   * @en Triggered after the tooltip visibility change is complete and all animations have finished.
   * @detail 当前是否可见
   * @detailEn Whether it is currently visible
   */
  @event({ type: "after.open.change" })
  accessor #afterOpenChangeEvent!: EventEmitter<boolean>;
  #handleAfterOpenChange = (open: boolean): void => {
    this.#afterOpenChangeEvent.emit(open);
  };

  render() {
    return (
      <EoTooltipComponent
        icon={this.icon}
        content={this.content}
        placement={this.placement}
        disabled={this.disabled}
        open={this.open}
        trigger={this.trigger}
        hoist={this.hoist}
        maxWidth={this.maxWidth}
        onOpenChange={this.#handleOpenChange}
        onAfterOpenChange={this.#handleAfterOpenChange}
      />
    );
  }
}

interface ToolTipComponentProps extends ToolTipProps {
  onOpenChange?: (open: boolean) => void;
  onAfterOpenChange?: (open: boolean) => void;
}

export function EoTooltipComponent(props: ToolTipComponentProps) {
  const {
    content,
    placement,
    disabled,
    open,
    trigger,
    hoist,
    maxWidth,
    icon,
    onOpenChange,
    onAfterOpenChange,
  } = props;

  const contentSlotRef = useRef<HTMLSlotElement>(null);
  const [hasContentSlot, setHasContentSlot] = useState<boolean>();

  useEffect(() => {
    const contentSlot = contentSlotRef.current;
    const handleSlotChange = () => {
      setHasContentSlot(contentSlot!.assignedElements().length > 0);
    };

    contentSlot?.addEventListener("slotchange", handleSlotChange);

    return () => {
      contentSlot?.removeEventListener("slotchange", handleSlotChange);
    };
  }, []);

  return (
    <WrappedSlTooltip
      content={content}
      placement={placement}
      disabled={!hasContentSlot && !content ? true : disabled}
      open={open}
      trigger={trigger}
      hoist={hoist}
      distance={ARROW_SIZE + DISTANCE}
      style={
        {
          "--sl-tooltip-arrow-size": ARROW_SIZE + "px",
          "--max-width": maxWidth,
        } as CSSProperties
      }
      onSlShow={() => onOpenChange?.(true)}
      onSlHide={() => onOpenChange?.(false)}
      onSlAfterShow={() => onAfterOpenChange?.(true)}
      onSlAfterHide={() => onAfterOpenChange?.(false)}
    >
      {icon ? <WrappedIcon {...icon} /> : null}
      <slot ref={contentSlotRef} name="content" slot="content">
        {content}
      </slot>
      <slot />
    </WrappedSlTooltip>
  );
}
