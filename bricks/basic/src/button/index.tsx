import React, { useMemo, Ref, type HTMLAttributes } from "react";
import { createDecorators } from "@next-core/element";
import {
  ReactNextElement,
  wrapBrick,
  wrapLocalBrick,
} from "@next-core/react-element";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
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
import {
  ALLOWED_BUTTON_TYPES,
  ALLOWED_COMPONENT_SIZES,
  ALLOWED_SHAPES,
} from "../constants.js";

export const WrappedLink = wrapLocalBrick<Link, LinkProps>("eo-link");
const WrappedTooltip = wrapLocalBrick<EoTooltip, ToolTipProps>("eo-tooltip");

// DO NOT delete these lines below:
// To make Module Federation work as expected.
// istanbul ignore next
// eslint-disable-next-line no-constant-condition
if (false) {
  // eslint-disable-next-line no-console
  console.log(ReactUseMultipleBricks);
}

export interface ButtonProps {
  type?: ButtonType;
  size?: ComponentSize;
  icon?: GeneralIconProps & HTMLAttributes<GeneralIcon>;
  shape?: Shape;
  danger?: boolean;
  disabled?: boolean;
  url?: string;
  href?: string;
  target?: string;
  tooltip?: string;
  buttonStyle?: React.CSSProperties;
  callback?: Ref<HTMLButtonElement>;
  themeVariant?: "default" | "elevo";
}

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * 通用按钮构件
 * @en A general-purpose button brick
 * @author sailor
 * @part button - 按钮元素
 * @partEn button - The button element
 * @slot - 按钮内容
 * @slotEn - The button content
 * @event click - 点击
 * @eventEn click - Click
 * @category interact-basic
 */
@defineElement("eo-button", {
  styleTexts: [styleText],
  alias: ["basic.general-button"],
})
class Button extends ReactNextElement implements ButtonProps {
  /**
   * 按钮类型
   * @en Button type
   */
  @property() accessor type: ButtonType | undefined;

  /**
   * 按钮大小
   * @en Button size
   * @default "medium"
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 是否开启危险状态
   * @en Whether to enable the danger state
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor danger: boolean | undefined;

  /**
   * 图标
   * @en Icon
   */
  @property({
    attribute: false,
  })
  accessor icon: (GeneralIconProps & HTMLAttributes<GeneralIcon>) | undefined;

  /**
   * 按钮形状，支持圆形、椭圆形，不设置为默认方形
   * @en Button shape; circle and ellipse are supported. The default is square when not set.
   * @group ui
   */
  @property()
  accessor shape: Shape | undefined;

  /**
   * 是否禁用
   * @en Whether it is disabled
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 链接地址
   * @en Link address
   */
  @property({
    attribute: false,
  })
  accessor url: string | undefined;

  /**
   * 跳转外链地址
   * @en External link address to navigate to
   */
  @property() accessor href: string | undefined;

  /**
   * 链接类型
   * @en Link type
   */
  @property() accessor target: string | undefined;

  /**
   * 鼠标悬停时显示的提示文字
   * @en Tooltip text displayed on mouse hover
   */
  @property() accessor tooltip: string | undefined;

  /**
   * 按钮样式
   * @en Button style
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

  /**
   * 主题变体
   * @en Theme variant
   */
  @property()
  accessor themeVariant: "default" | "elevo" | undefined;

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
        themeVariant={this.themeVariant}
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
  themeVariant,
  callback,
}: ButtonProps) {
  const buttonNode = useMemo(() => {
    const button = (
      <button
        ref={callback}
        className={classNames(
          ALLOWED_COMPONENT_SIZES.includes(size) ? size : "medium",
          shape && ALLOWED_SHAPES.includes(shape) ? shape : null,
          ALLOWED_BUTTON_TYPES.includes(type) ? type : "default",
          { danger }
        )}
        part="button"
        style={buttonStyle}
        disabled={disabled}
      >
        {icon && <WrappedIcon {...icon} />}
        {type === "ai-alt" ? (
          <span className="gradient-text">
            <slot />
          </span>
        ) : (
          <slot />
        )}
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
      themeVariant={themeVariant}
    >
      {buttonNode}
    </WrappedLink>
  ) : (
    buttonNode
  );
}

export { Button };
