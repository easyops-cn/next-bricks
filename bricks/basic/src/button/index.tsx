import React, { useMemo, Ref } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { ButtonType, ComponentSize, Shape, Target } from "../interface.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../link/index.js";
import type { EoTooltip, ToolTipProps } from "../tooltip/index.jsx";
import classNames from "classnames";
import styleText from "./button.shadow.css";
import "@next-core/theme";

export const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

export interface ButtonProps {
  type?: ButtonType;
  size?: ComponentSize;
  icon?: GeneralIconProps;
  shape?: Shape;
  danger?: boolean;
  disabled?: boolean;
  url?: string;
  href?: string;
  target?: string;
  tooltip?: string;
  buttonStyle?: React.CSSProperties;
  callback?: Ref<HTMLButtonElement>;
}

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * 通用按钮构件
 * @author sailor
 * @slot - 按钮内容
 * @category interact-basic
 */
@defineElement("eo-button", {
  styleTexts: [styleText],
  alias: ["basic.general-button"],
})
class Button extends ReactNextElement implements ButtonProps {
  /** 按钮类型 */
  @property() accessor type: ButtonType | undefined;

  /**
   * 按钮大小
   * @default "medium"
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 是否开启危险状态
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor danger: boolean | undefined;

  /** 图标 */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 按钮形状，支持圆形、椭圆形，不设置为默认方形
   * @group ui
   */
  @property()
  accessor shape: Shape | undefined;

  /**
   * 是否禁用
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /** 链接地址 */
  @property({
    attribute: false,
  })
  accessor url: string | undefined;

  /** 跳转外链地址 */
  @property() accessor href: string | undefined;

  /** 链接类型 */
  @property() accessor target: string | undefined;

  /** tooltip */
  @property() accessor tooltip: string | undefined;

  /**
   * 按钮样式
   * @group other
   */
  @property({ attribute: false }) accessor buttonStyle:
    | React.CSSProperties
    | undefined;

  /**
   * 是否有 slot
   * @internal
   */
  @property({
    type: Boolean,
  })
  accessor hasSlot: boolean | undefined;

  #getSlotBySelector(selector: string): HTMLSlotElement {
    return this.shadowRoot?.querySelector(selector) as HTMLSlotElement;
  }

  #renderCallback = () => {
    const slot = this.#getSlotBySelector("slot");

    slot?.addEventListener("slotchange", () => {
      this.hasSlot = slot.assignedNodes().length > 0;
    });
  };

  render() {
    return (
      <ButtonComponent
        type={this.type}
        size={this.size}
        danger={this.danger}
        disabled={this.disabled}
        icon={this.icon}
        shape={this.shape}
        url={this.url}
        href={this.href}
        target={this.target}
        tooltip={this.tooltip}
        buttonStyle={this.buttonStyle}
        callback={this.#renderCallback}
      />
    );
  }
}

export function ButtonComponent({
  type = "default",
  size = "medium",
  icon,
  shape,
  danger,
  disabled,
  url,
  href,
  target,
  tooltip,
  buttonStyle,
  callback,
}: ButtonProps) {
  const buttonNode = useMemo(() => {
    const button = (
      <button
        ref={callback}
        className={classNames(size, shape, type, {
          danger: danger,
        })}
        style={buttonStyle}
        disabled={disabled}
      >
        {icon && <WrappedIcon {...icon} />}
        <slot />
      </button>
    );

    // mouse events don't trigger at disabled button in Chrome, so the tooltip don't work
    // wrap the disabled button in span to make it work in tooltip
    const wrappedNode = disabled ? (
      <span
        style={{ display: "inline-block", cursor: "not-allowed" }}
        // disabled button should not trigger click event
        onClick={/* istanbul ignore next */ (e) => e.stopPropagation()}
      >
        {button}
      </span>
    ) : (
      button
    );

    return tooltip ? (
      <WrappedTooltip content={tooltip}>{wrappedNode}</WrappedTooltip>
    ) : (
      wrappedNode
    );
  }, [
    size,
    shape,
    type,
    disabled,
    danger,
    buttonStyle,
    icon,
    tooltip,
    callback,
  ]);

  return url || href ? (
    <WrappedLink
      type="plain"
      href={href}
      target={target as Target}
      url={url}
      disabled={disabled}
    >
      {buttonNode}
    </WrappedLink>
  ) : (
    buttonNode
  );
}

export { Button };
