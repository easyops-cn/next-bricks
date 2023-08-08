import { createProviderClass } from "@next-core/utils/general";
import { wrapBrick } from "@next-core/react-element";
import styles from "./notification.module.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classnames from "classnames";
// Specify brick dependencies:
/*#__PURE__*/ wrapBrick("sl-alert");
/*#__PURE__*/ wrapBrick("eo-icon");

/**
 * 显示通知消息。
 *
 * @param options 选项
 */
export function showNotification({
  type,
  message,
  title,
  placement = "center",
  closable,
  icon,
  duration = 3000,
  styleType = "circleAngle",
}: {
  /** 通知类型 */
  type?: "success" | "error" | "warn" | "info";
  /** 默认三秒后自动关闭 */
  duration?: number;
  /** 弹出位置，默认居中 */
  placement?: "center" | "topRight";
  /**
   * 通知标题
   */
  title?: string;
  /** 通知内容 */
  message: string;
  /** 允许手动关闭消息提示 */
  closable?: boolean;
  /** 自定义图标 */
  icon?: GeneralIconProps;
  /**样式类型，默认圆角样式 */
  styleType?: "circleAngle" | "rectAngle";
}): void {
  const notification = document.createElement("sl-alert") as any;
  const eoIcon = document.createElement("eo-icon") as GeneralIcon;
  eoIcon.slot = "icon";
  eoIcon.theme = "filled";
  eoIcon.lib = "antd";
  switch (type) {
    case "success":
      notification.variant = "success";
      eoIcon.icon = "check-circle";
      break;
    case "error":
      notification.variant = "danger";
      eoIcon.icon = "close-circle";
      break;
    case "warn":
      notification.variant = "warning";
      eoIcon.icon = "exclamation-circle";
      break;
    default:
      notification.variant = "primary";
      eoIcon.icon = "info-circle";
  }

  if (icon) {
    Object.assign(eoIcon, icon);
  }

  notification.duration = duration;
  notification.closable = closable;
  notification.className = classnames(
    styles.notification,
    styles[placement],
    styles[styleType]
  );
  if (title) {
    const notificationTitle = document.createElement("div");
    notificationTitle.textContent = title;
    notificationTitle.className = styles.title;
    notification.append(notificationTitle);
  }
  const text = document.createTextNode(message);
  notification.append(eoIcon, text);
  notification.toast();
}

customElements.define(
  "basic.show-notification",
  createProviderClass(showNotification)
);
