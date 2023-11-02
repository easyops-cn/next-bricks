import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
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
  ExtendedLocationDescriptor,
  getExtendedLocationDescriptor,
} from "./getExtendedLocationDescriptor.js";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface LinkProps {
  type?: LinkType;
  disabled?: boolean;
  url?: ExtendedLocationDescriptor;
  href?: string;
  icon?: GeneralIconProps;
  target?: Target;
  showExternalIcon?: boolean;
  underline?: boolean;
  replace?: boolean;
  danger?: boolean;
  linkStyle?: React.CSSProperties;
}

const { defineElement, property } = createDecorators();

/**
 * 通用链接构件
 * @author sailor
 *
 * @part link - 锚元素
 *
 * @slot - 链接内容
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
        showExternalIcon={this.showExternalIcon}
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
  showExternalIcon,
  icon,
  underline,
  danger,
  replace,
  linkStyle,
}: LinkProps) {
  const history = getHistory();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [currentLocation, setCurrentLocation] = useState(history.location);

  const computedHref = useMemo(() => {
    if (disabled) return;
    if (href) return href;
    if (!url) return "";
    const loc =
      typeof url === "string"
        ? createLocation(url, null, undefined, currentLocation)
        : getExtendedLocationDescriptor(url, currentLocation);
    return loc
      ? history.createHref(loc as LocationDescriptorObject<NextHistoryState>)
      : "";
  }, [disabled, href, url, currentLocation, history]);

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
            ? url
            : getExtendedLocationDescriptor(url, currentLocation)
        );
      }
    },
    [currentLocation, disabled, history, href, replace, target, url]
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

  return (
    <>
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
