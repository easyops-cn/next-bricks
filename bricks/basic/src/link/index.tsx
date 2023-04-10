import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { LinkType, Target } from "../interface.js";
import styleText from "./link.shadow.css";
import classNames from "classnames";
import "@next-core/theme";
import { getHistory } from "@next-core/runtime";
import {
  createLocation,
  LocationState,
} from "history";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface LinkProps {
  type?: LinkType;
  disabled?: boolean;
  href?: string;
  icon?: GeneralIconProps;
  target?: Target;
  underline?: boolean;
  replace?: boolean;
  linkStyle?: React.CSSProperties;
}

const { defineElement, property } = createDecorators();

/**
 * @id basic.general-link
 * @name basic.general-link
 * @docKind brick
 * @description 通用链接构件
 * @author sailor
 * @noInheritDoc
 */
@defineElement("basic.general-link", {
  styleTexts: [styleText],
})
class Link extends ReactNextElement implements LinkProps {
  /**
   * @kind LinkType
   * @required false
   * @default default
   * @description 链接类型
   * @enums
   * @group basic
   */
  @property() accessor type: LinkType | undefined;

  /**
   * @kind boolean
   * @required false
   * @default false
   * @description 是否禁用
   * @group basic
   */
  @property() accessor disabled: boolean | undefined;

  /**
   * @kind string
   * @required false
   * @default -
   * @description 链接地址
   * @group basic
   */
  @property() accessor href: string | undefined;

  /**
   * @kind Target
   * @required false
   * @default -
   * @description 链接跳转类型
   * @enums
   * @group basic
   */
  @property() accessor target: Target | undefined;

  /**
   * @kind boolean
   * @required false
   * @default false
   * @description 下划线
   * @group basic
   */
  @property({
    type: Boolean,
  }) accessor underline: boolean | undefined;

  /**
   * @kind boolean
   * @required false
   * @default false
   * @description 是否替换当前url
   * @group basic
   */
  @property() accessor replace: boolean | undefined;

  /**
   * @kind GeneralIconProps
   * @required false
   * @default -
   * @description 图标
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * @kind React.CSSProperties
   * @required false
   * @default -
   * @description 链接样式
   * @group other
   */
  @property({ attribute: false }) accessor linkStyle:
    | React.CSSProperties
    | undefined;

  render() {
    return (
      <LinkComponent
        type={this.type}
        disabled={this.disabled}
        href={this.href}
        target={this.target}
        icon={this.icon}
        underline={this.underline}
        linkStyle={this.linkStyle}
        replace={this.replace}
      />
    );
  }
}

export function LinkComponent({
  type = "link",
  disabled,
  href,
  target,
  icon,
  underline,
  replace,
  linkStyle,
}: LinkProps) {
  const history = getHistory();

  const computedHref = useMemo(() => {
    if (!href) return "";
    const loc = createLocation(
      href,
      null,
      undefined,
      history.location
    ) as LocationState;
    return loc ? history.createHref(loc) : "";
  }, [history, href]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (target === "_blank") {
      window.open(computedHref);
      return;
    }

    const method = replace ? history.replace : history.push;

    method(computedHref);
  };

  return (
    <a
      className={classNames({
        [type]: type,
        disabled: disabled,
        underline: underline,
      })}
      style={linkStyle}
      href={computedHref}
      target={target}
      onClick={handleClick}
    >
      {icon && <WrappedIcon {...icon} />}
      <slot />
    </a>
  );
}

export { Link };
