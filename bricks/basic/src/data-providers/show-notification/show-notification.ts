import { createProviderClass } from "@next-core/utils/general";
import { wrapBrick } from "@next-core/react-element";
import styles from "./notification.module.css";
import type { AntdIcon } from "@next-bricks/icons/antd-icon";

// Specify brick dependencies:
/*#__PURE__*/ wrapBrick("sl-alert");
/*#__PURE__*/ wrapBrick("icons.antd-icon");

/**
 * 显示通知消息。
 *
 * @param options 选项
 */
export function showNotification({
  type,
  message,
}: {
  /** 通知类型 */
  type?: "success" | "error" | "warn" | "info";
  /** 通知内容 */
  message: string;
}): void {
  const notification = document.createElement("sl-alert") as any;
  const icon = document.createElement("icons.antd-icon") as AntdIcon;
  icon.slot = "icon";
  icon.theme = "filled";
  switch (type) {
    case "success":
      notification.variant = "success";
      icon.icon = "check-circle";
      break;
    case "error":
      notification.variant = "danger";
      icon.icon = "close-circle";
      break;
    case "warn":
      notification.variant = "warning";
      icon.icon = "exclamation-circle";
      break;
    default:
      notification.variant = "primary";
      icon.icon = "info-circle";
  }
  notification.duration = 3000;
  notification.className = styles.notification;
  const text = document.createTextNode(message);
  notification.append(icon, text);
  notification.toast();
}

customElements.define(
  "basic.show-notification",
  createProviderClass(showNotification)
);
