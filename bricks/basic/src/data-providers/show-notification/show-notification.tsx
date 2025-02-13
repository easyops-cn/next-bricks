import React, { useCallback, useMemo, useRef } from "react";
import { createProviderClass } from "@next-core/utils/general";
import { wrapBrick, wrapLocalBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classnames from "classnames";
import { sanitize } from "dompurify";
import { i18n, initializeI18n } from "@next-core/i18n";
import { createRoot } from "react-dom/client";
import { WrappedSlAlert, SlAlertElement } from "./sl-alert.js";
import type { Link, LinkProps, Target } from "../../link/index.js";
import { K, NS, locales } from "../show-dialog/i18n";
import {
  activeKeyframeAnimationOptions,
  animations,
  hideKeyframeAnimationOptions,
} from "./constants";
import styles from "./notification.module.css";
import { pick } from "lodash";

initializeI18n(NS, locales);

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedLink = wrapLocalBrick<Link, LinkProps>("eo-link");

export interface NotificationOptions {
  /** 通知类型 */
  type?: "success" | "error" | "warn" | "info";
  /** 默认三秒后自动关闭 */
  duration?: number;
  /** 弹出位置，默认居中 */
  placement?: "center" | "topRight";
  /** 通知标题 */
  title?: string | null;
  /** 通知内容 */
  message?: string | null;
  /** HTML 格式的通知内容，该内容会被 dom-purify sanitize */
  htmlMessage?: string;
  inlineLink?: {
    text: string;
    url?: string;
    href?: string;
    target?: Target;
  };
  /** 允许手动关闭消息提示 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: GeneralIconProps & { style?: React.CSSProperties };
  /**样式类型，默认圆角样式 */
  styleType?: "circleAngle" | "rectAngle";
  /** 确认文本 */
  confirmText?: string;
  /** 确认链接选项 */
  confirmLink?: LinkOptions;
  /** 取消文本 */
  cancelText?: string;
  /** 展示确认按钮 */
  showConfirm?: boolean;
  /** 展示取消按钮 */
  showCancel?: boolean;
}

export interface LinkOptions {
  url?: string;
  href?: string;
  target?: Target;
}

/**
 * 显示通知消息。
 *
 * @param options 选项
 */
export async function showNotification(
  options: NotificationOptions
): Promise<void> {
  const { placement = "center" } = options;
  let wrapper = document.querySelector(
    `body > .notification-wrapper-${placement}`
  );
  if (!wrapper) {
    const newElement = document.createElement("div");
    newElement.className = classnames(
      `notification-wrapper-${placement}`,
      styles.notificationWrapper,
      styles[placement]
    );

    document.body.append(newElement);

    wrapper = newElement;
  }

  const container = document.createElement("div");
  container.className = classnames(styles.notificationItem);
  wrapper!.appendChild(container);
  const root = createRoot(container);

  let onOk: (() => void) | undefined;
  let onCancel: (() => void) | undefined;

  const promise = new Promise<void>((resolve, reject) => {
    onOk = resolve;
    onCancel = reject;
  });

  const onHide = async () => {
    const callback = () => {
      root.unmount();
      container.remove();
    };

    if (animations[placement]?.hide) {
      const animation = container.animate(
        animations[placement].hide,
        hideKeyframeAnimationOptions
      );

      animation.onfinish = callback;
    } else {
      callback();
    }
  };

  root.render(
    <NotificationComponent
      {...options}
      onOk={onOk}
      onCancel={onCancel}
      onHide={onHide}
    />
  );

  if (animations[placement]?.active)
    await container.animate(
      animations[placement].active,
      activeKeyframeAnimationOptions
    );

  return promise;
}

function NotificationComponent({
  type,
  message,
  htmlMessage,
  title,
  placement = "center",
  closable,
  icon,
  duration = 3000,
  styleType = "circleAngle",
  confirmText,
  confirmLink,
  cancelText,
  showConfirm = false,
  showCancel = false,
  inlineLink,
  onOk,
  onCancel,
  onHide,
}: NotificationOptions & {
  onOk?(): void;
  onCancel?(): void;
  onHide?(): void;
}): React.ReactNode {
  const ref = useRef<SlAlertElement | null>(null);

  const alertProps = useMemo(() => {
    let variant;
    switch (type) {
      case "success":
        variant = "success";
        break;
      case "error":
        variant = "danger";
        break;
      case "warn":
        variant = "warning";
        break;
      default:
        variant = "primary";
    }

    return {
      variant,
      closable,
      duration: showConfirm || showCancel ? null : duration,
    };
  }, [closable, duration, showCancel, showConfirm, type]);

  const iconProps = useMemo(() => {
    let defaultIcon;
    switch (type) {
      case "success":
        defaultIcon = "check-circle";
        break;
      case "error":
        defaultIcon = "close-circle";
        break;
      case "warn":
        defaultIcon = "exclamation-circle";
        break;
      default:
        defaultIcon = "info-circle";
    }
    return {
      lib: "antd",
      icon: defaultIcon,
      ...(icon ?? {}),
    };
  }, [icon, type]);

  const handleSlHide = useCallback(() => {
    onHide?.();
    showConfirm && showCancel ? onCancel?.() : onOk?.();
  }, [onCancel, onHide, onOk, showCancel, showConfirm]);

  const onOkClick = useCallback(() => {
    onHide?.();
    onOk?.();
  }, [onHide, onOk]);

  const onCancelClick = useCallback(() => {
    onHide?.();
    onCancel?.();
  }, [onCancel, onHide]);

  return (
    <WrappedSlAlert
      open
      ref={ref}
      className={classnames(
        styles.notification,
        styles[placement],
        styles[styleType]
      )}
      {...alertProps}
      onSlHide={handleSlHide}
    >
      <WrappedIcon slot="icon" {...iconProps}></WrappedIcon>
      {title && <div className={styles.title}>{title}</div>}
      {htmlMessage ? (
        <div
          className={styles.message}
          dangerouslySetInnerHTML={{ __html: sanitize(htmlMessage) }}
        />
      ) : message ? (
        <div className={styles.message}>
          {message}
          {inlineLink && (
            <WrappedLink
              {...pick(inlineLink, "url", "href", "target")}
              style={{ marginLeft: "0.5em" }}
            >
              {inlineLink.text}
            </WrappedLink>
          )}
        </div>
      ) : null}
      {(showConfirm || showCancel) && (
        <div className={styles.operateWrapper}>
          {showConfirm && (
            <WrappedLink {...confirmLink} onClick={onOkClick}>
              {confirmText ?? i18n.t(`${NS}:${K.OK}`)}
            </WrappedLink>
          )}
          {showCancel && (
            <WrappedLink type="text" onClick={onCancelClick}>
              {cancelText ?? i18n.t(`${NS}:${K.CANCEL}`)}
            </WrappedLink>
          )}
        </div>
      )}
    </WrappedSlAlert>
  );
}

customElements.define(
  "basic.show-notification",
  createProviderClass(showNotification)
);
