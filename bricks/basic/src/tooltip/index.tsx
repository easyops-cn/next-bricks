import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
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

export interface ToolTipProps
  extends Pick<
    SlTooltipProps,
    "content" | "placement" | "disabled" | "open" | "trigger" | "hoist"
  > {
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
 * 提示
 *
 * @slot - 提示的目标元素
 * @slot content - 放置在提示中的元素
 *
 * @category feedback-and-tooltip
 */
export
@defineElement("eo-tooltip", {
  styleTexts: [styleText],
})
class EoTooltip extends ReactNextElement implements ToolTipProps {
  /**
   * 内容
   */
  @property()
  accessor content: string | undefined;

  /**
   * 弹出位置
   */
  @property()
  accessor placement: Placement | undefined;

  /**
   * 是否禁用
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * 是否显示
   */
  @property({ type: Boolean })
  accessor open: boolean | undefined;

  /**
   * 激活方式，包括 `click` | `hover` | `focus` | `manual`，可以多选用空格分隔
   */
  @property()
  accessor trigger: string | undefined;

  /**
   * 是否使用固定定位防止内容被裁切
   */
  @property({ type: Boolean })
  accessor hoist: boolean | undefined;

  /**
   * 最大长度
   */
  @property()
  accessor maxWidth: string | undefined;

  /**
   * 显示提示
   */
  @method()
  show() {
    this.open = true;
  }

  /**
   * 隐藏提示
   */
  @method()
  hide() {
    this.open = false;
  }

  /**
   * 当提示可见性开始变化时触发
   * @detail 当前是否可见
   */
  @event({ type: "open.change" })
  accessor #openChangeEvent!: EventEmitter<boolean>;
  #handleOpenChange = (open: boolean): void => {
    this.open = open;
    this.#openChangeEvent.emit(open);
  };

  /**
   * 当提示可见性变化完成并完成所有动画后触发。
   * @detail 当前是否可见
   */
  @event({ type: "after.open.change" })
  accessor #afterOpenChangeEvent!: EventEmitter<boolean>;
  #handleAfterOpenChange = (open: boolean): void => {
    this.#afterOpenChangeEvent.emit(open);
  };

  render() {
    return (
      <EoTooltipComponent
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
      <slot ref={contentSlotRef} name="content" slot="content">
        {content}
      </slot>
      <slot />
    </WrappedSlTooltip>
  );
}
