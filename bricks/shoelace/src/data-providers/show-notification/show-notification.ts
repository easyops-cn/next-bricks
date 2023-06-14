import { createProviderClass } from "@next-core/utils/general";
import styles from "./styles.module.css";

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
  "shoelace.show-notification",
  createProviderClass(showNotification)
);
