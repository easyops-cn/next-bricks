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
import { getHistory } from "@next-core/runtime";
import { createLocation, LocationState } from "history";
import { isEmpty } from "lodash";
import "@next-core/theme";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface LinkProps {
  type?: LinkType;
  disabled?: boolean;
  url?: string;
  href?: string;
  icon?: GeneralIconProps;
  target?: Target;
  underline?: boolean;
  replace?: boolean;
  danger?: boolean;
  linkStyle?: React.CSSProperties;
}

const { defineElement, property } = createDecorators();

/**
 * 通用链接构件
 * @author sailor
 * @slot - 链接内容
 */
@defineElement("basic.general-link", {
  styleTexts: [styleText],
})
class Link extends ReactNextElement implements LinkProps {
  /**
   * 链接类型
   * @default "link"
   */
  @property() accessor type: LinkType | undefined;

  /**
   * 是否禁用
   * @default false
   */
  @property({ type: Boolean }) accessor disabled: boolean | undefined;

  /**
   * 设置 `href` 时将使用原生 `<a>` 标签，通常用于外链的跳转
   */
  @property() accessor href: string | undefined;

  /**
   * 链接地址
   */
  @property() accessor url: string | undefined;

  /**
   * 链接跳转目标
   */
  @property() accessor target: Target | undefined;

  /**
   * 是否显示下划线
   */
  @property({
    type: Boolean,
  })
  accessor underline: boolean | undefined;

  /**
   * 是否使用 `history.replace` 而不是默认的 `history.push`
   * @default false
   */
  @property() accessor replace: boolean | undefined;

  /**
   * 图标
   * @group io
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 是否开启危险状态
   */
  @property({
    type: Boolean,
  })
  accessor danger: boolean | undefined;

  /**
   * 链接样式
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
        url={this.url}
        href={this.href}
        target={this.target}
        icon={this.icon}
        underline={this.underline}
        danger={this.danger}
        linkStyle={this.linkStyle}
        replace={this.replace}
      />
    );
  }
}

function isModifiedEvent(event: MouseEvent | React.MouseEvent): boolean {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function LinkComponent({
  type = "link",
  disabled,
  url,
  href,
  target,
  icon,
  underline,
  danger,
  replace,
  linkStyle,
}: LinkProps) {
  const history = getHistory();

  const computedHref = useMemo(() => {
    if (href) return href;
    if (!url) return "";
    const loc = createLocation(
      url,
      null,
      undefined,
      history.location
    ) as LocationState;
    return loc ? history.createHref(loc) : "";
  }, [history, url, href]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (href) return;

    if (
      !e.defaultPrevented && // onClick prevented default
      e.button === 0 && // ignore everything but left clicks
      (!target || target === "_self") && // let browser handle "target=_blank" etc.
      !isModifiedEvent(e) // ignore clicks with modifier keys
    ) {
      e.preventDefault();

      if (!url) return;

      const method = replace ? history.replace : history.push;

      method(computedHref);
    }
  };

  return (
    <a
      part="link"
      className={classNames({
        [type]: type,
        danger: danger,
        disabled: disabled,
        underline: underline,
      })}
      style={linkStyle}
      href={isEmpty(computedHref) ? undefined : computedHref}
      target={target}
      onClick={handleClick}
    >
      {icon && <WrappedIcon {...icon} />}
      <slot />
    </a>
  );
}

export { Link };
