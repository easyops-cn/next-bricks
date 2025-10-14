import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { useCurrentApp } from "@next-core/react-runtime";
import type { EoTooltip, ToolTipProps } from "../tooltip";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { LinkType, Target } from "../interface.js";
import styleText from "./link.shadow.css";
import classNames from "classnames";
import { getHistory, NextHistoryState } from "@next-core/runtime";
import { createLocation, LocationDescriptorObject } from "history";
import { isEmpty } from "lodash";
import "@next-core/theme";
import {
  type ExtendedLocationDescriptor,
  getExtendedLocationDescriptor,
} from "./getExtendedLocationDescriptor.js";

export type { ExtendedLocationDescriptor } from "./getExtendedLocationDescriptor.js";
export type { Target } from "../interface.js";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

export interface LinkProps {
  type?: LinkType;
  disabled?: boolean;
  url?: ExtendedLocationDescriptor;
  href?: string;
  inApp?: boolean;
  icon?: GeneralIconProps;
  target?: Target;
  showExternalIcon?: boolean;
  underline?: boolean;
  replace?: boolean;
  danger?: boolean;
  tooltip?: string;
  linkStyle?: React.CSSProperties;
  themeVariant?: "default" | "elevo";
}

const { defineElement, property } = createDecorators();

/**
 * 通用链接构件
 * @author sailor
 *
 * @part link - 锚元素
 *
 * @event click - 点击
 *
 * @slot - 链接内容
 *
 * @category text
 */
@defineElement("eo-link", {
  styleTexts: [styleText],
  alias: ["basic.general-link"],
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
  @property({
    attribute: false,
  })
  accessor url: ExtendedLocationDescriptor | undefined;

  /**
   * 标识 `url` 是否为微应用内链接（即使用 APP.homepage 作为前缀）
   */
  @property({ type: Boolean }) accessor inApp: boolean | undefined;

  /**
   * 链接跳转目标
   */
  @property() accessor target: Target | undefined;

  /**
   * target 为 _blank 时，是否在后面显示特定图标
   */
  @property({ type: Boolean })
  accessor showExternalIcon: boolean | undefined;

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
   * 文字提示
   */
  @property() accessor tooltip: string | undefined;

  /**
   * 链接样式
   * @group other
   */
  @property({ attribute: false }) accessor linkStyle:
    | React.CSSProperties
    | undefined;

  /** 主题变体 */
  @property({ render: false })
  accessor themeVariant: "default" | "elevo" | undefined;

  render() {
    return (
      <LinkComponent
        type={this.type}
        disabled={this.disabled}
        url={this.url}
        href={this.href}
        inApp={this.inApp}
        target={this.target}
        showExternalIcon={this.showExternalIcon}
        icon={this.icon}
        underline={this.underline}
        danger={this.danger}
        linkStyle={this.linkStyle}
        replace={this.replace}
        tooltip={this.tooltip}
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
  inApp,
  target,
  showExternalIcon,
  icon,
  underline,
  danger,
  replace,
  tooltip,
  linkStyle,
}: LinkProps) {
  const history = getHistory();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [currentLocation, setCurrentLocation] = useState(history.location);
  const app = useCurrentApp();
  const prefixWithHomepage = inApp ? app?.homepage : undefined;

  const computedHref = useMemo(() => {
    if (disabled) return;
    if (href) return href;
    if (!url) return "";
    const loc =
      typeof url === "string"
        ? createLocation(
            prefixWithHomepage
              ? `${prefixWithHomepage}${url === "/" ? "" : url}`
              : url,
            null,
            undefined,
            currentLocation
          )
        : getExtendedLocationDescriptor(url, currentLocation);
    return loc
      ? history.createHref(loc as LocationDescriptorObject<NextHistoryState>)
      : "";
  }, [disabled, href, url, currentLocation, history, prefixWithHomepage]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
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
        method(
          typeof url === "string"
            ? prefixWithHomepage
              ? `${prefixWithHomepage}${url === "/" ? "" : url}`
              : url
            : getExtendedLocationDescriptor(
                prefixWithHomepage
                  ? {
                      ...url,
                      pathname: `${prefixWithHomepage}${url.pathname === "/" ? "" : url.pathname}`,
                    }
                  : url,
                currentLocation
              )
        );
      }
    },
    [
      currentLocation,
      disabled,
      history,
      href,
      replace,
      target,
      url,
      prefixWithHomepage,
    ]
  );

  useEffect(() => {
    // Listen history change only when necessary.
    if (typeof url !== "string" && url?.keepCurrentSearch) {
      return history.listen((loc) => {
        setCurrentLocation(loc);
      });
    }
  }, [history, url]);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    link.addEventListener("click", handleClick);
    return () => {
      link.removeEventListener("click", handleClick);
    };
  });

  const linkNode = (
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
      ref={linkRef}
    >
      {icon && <WrappedIcon part="icon" {...icon} />}
      <slot />
    </a>
  );

  return (
    <>
      {tooltip ? (
        <WrappedTooltip content={tooltip}>{linkNode}</WrappedTooltip>
      ) : (
        linkNode
      )}
      {showExternalIcon && (
        <WrappedIcon
          className="external-icon"
          lib="fa"
          icon="external-link-alt"
        />
      )}
    </>
  );
}

export { Link };
