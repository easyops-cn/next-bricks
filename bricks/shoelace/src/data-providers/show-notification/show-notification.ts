import { createProviderClass } from "@next-core/utils/general";

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
      icon.name = "check2-circle";
      break;
    case "error":
      notification.variant = "danger";
      icon.name = "exclamation-octagon";
      break;
    case "warn":
      notification.variant = "warning";
      icon.name = "exclamation-triangle";
      break;
    default:
      notification.variant = "primary";
      icon.name = "info-circle";
  }
  notification.duration = 3000;
  const text = document.createTextNode(message);
  notification.append(icon, text);
  notification.toast();
}

customElements.define(
  "shoelace.show-notification",
  createProviderClass(showNotification)
);
