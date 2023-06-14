import { createProviderClass } from "@next-core/utils/general";
import { wrapBrick } from "@next-core/react-element";
import styles from "./notification.module.css";

// Specify brick dependencies:
/*#__PURE__*/ wrapBrick("sl-alert");
/*#__PURE__*/ wrapBrick("sl-icon");

export function showNotification({
  type,
  message,
}: {
  type?: "success" | "error" | "warn" | "info";
  message: string;
}) {
  const notification = document.createElement("sl-alert") as any;
  const icon = document.createElement("sl-icon") as any;
  icon.slot = "icon";
  switch (type) {
    case "success":
      notification.variant = "success";
      icon.name = "check-circle-fill";
      break;
    case "error":
      notification.variant = "danger";
      icon.name = "x-circle-fill";
      break;
    case "warn":
      notification.variant = "warning";
      icon.name = "exclamation-circle-fill";
      break;
    default:
      notification.variant = "primary";
      icon.name = "info-circle-fill";
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
