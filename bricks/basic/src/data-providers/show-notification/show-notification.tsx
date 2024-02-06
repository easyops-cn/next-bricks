import React, { useCallback, useMemo, useRef } from "react";
import { createProviderClass } from "@next-core/utils/general";
import { wrapBrick } from "@next-core/react-element";
import styles from "./notification.module.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classnames from "classnames";
import { WrappedSlAlert, SlAlertElement } from "./sl-alert.js";
import type { Link, LinkProps } from "../../link/index.js";
import { i18n, initializeI18n } from "@next-core/i18n";
import { K, NS, locales } from "../show-dialog/i18n";
import { createRoot } from "react-dom/client";
import {
  activeKeyframeAnimationOptions,
  animations,
  hideKeyframeAnimationOptions,
} from "./constants";

initializeI18n(NS, locales);

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

interface NotificationOptions {
  /** 通知类型 */
  type?: "success" | "error" | "warn" | "info";
  /** 默认三秒后自动关闭 */
  duration?: number;
  /** 弹出位置，默认居中 */
  placement?: "center" | "topRight";
  /** 通知标题 */
  title?: string;
  /** 通知内容 */
  message: string;
  /** 允许手动关闭消息提示 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: GeneralIconProps;
  /**样式类型，默认圆角样式 */
  styleType?: "circleAngle" | "rectAngle";
  /** 是否有操作区 */
  hasOperate?: boolean;
  /** 确认文本 */
  confirmText?: string;
  /** 取消文本 */
  cancelText?: string;
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
      styles[options.placement ?? "center"]
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
      onCancel?.();
    };

    if (animations[placement]?.hide) {
      const animation = container?.animate(
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
    await container?.animate(
      animations[placement].active,
      activeKeyframeAnimationOptions
    );

  return promise;
}

function NotificationComponent({
  type,
  message,
  title,
  placement = "center",
  closable,
  icon,
  duration = 3000,
  styleType = "circleAngle",
  hasOperate = false,
  confirmText,
  cancelText,
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
      duration: hasOperate ? null : duration,
    };
  }, [closable, duration, type, hasOperate]);

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

  const handleHide = useCallback(() => {
    onHide?.();
  }, [onHide]);

  const onOkClick = useCallback(() => {
    handleHide();
    onOk?.();
  }, [onOk, handleHide]);

  const onCancelClick = useCallback(() => {
    handleHide();
    onCancel?.();
  }, [onCancel, handleHide]);

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
      onSlHide={handleHide}
    >
      <WrappedIcon slot="icon" {...iconProps}></WrappedIcon>
      {title && <div className={styles.title}>{title}</div>}
      {message && <div className={styles.message}>{message}</div>}
      {hasOperate && (
        <div className={styles.operateWrapper}>
          <WrappedLink onClick={onOkClick}>
            {confirmText ?? i18n.t(`${NS}:${K.OK}`)}
          </WrappedLink>
          <WrappedLink type="text" onClick={onCancelClick}>
            {cancelText ?? i18n.t(`${NS}:${K.CANCEL}`)}
          </WrappedLink>
        </div>
      )}
    </WrappedSlAlert>
  );
}

customElements.define(
  "basic.show-notification",
  createProviderClass(showNotification)
);
