import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { ButtonType, ComponentSize, Shape, Target } from "../interface.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../link/index.js";
import classNames from "classnames";
import styleText from "./button.shadow.css";
import "@next-core/theme";

export const WrappedLink = wrapBrick<Link, LinkProps>("basic.general-link");
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
  buttonStyle?: React.CSSProperties;
}

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

/**
 * 通用按钮构件
 * @author sailor
 * @slot - 按钮内容
 */
@defineElement("basic.general-button", {
  styleTexts: [styleText],
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

  /**
   * 按钮样式
   * @group other
   */
  @property({ attribute: false }) accessor buttonStyle:
    | React.CSSProperties
    | undefined;

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
        buttonStyle={this.buttonStyle}
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
  buttonStyle,
}: ButtonProps) {
  const link = useMemo(
    () => (
      <WrappedLink
        className={classNames(size, {
          danger: danger,
        })}
        href={href}
        target={target as Target}
        url={url}
        disabled={disabled}
        danger={danger}
        icon={icon}
      >
        <slot />
      </WrappedLink>
    ),
    [size, danger, href, target, url, disabled, icon]
  );

  const button = useMemo(
    () => (
      <button
        className={classNames(size, shape, {
          [type]: !disabled || type === "text",
          danger: danger,
        })}
        style={buttonStyle}
        disabled={disabled}
      >
        {icon && <WrappedIcon className="icon" {...icon} />}
        <slot />
      </button>
    ),
    [size, shape, type, disabled, danger, buttonStyle, icon]
  );

  return type === "link" ? link : button;
}

export { Button };
