import { describe, test, expect } from "@jest/globals";
import { showNotification } from "./show-notification.js";

const toast = jest.fn();

customElements.define(
  "sl-alert",
  class extends HTMLElement {
    variant: string | undefined;
    duration: number | undefined;
    toast() {
      toast({
        variant: this.variant,
        duration: this.duration,
        icon: (this.querySelector("eo-antd-icon") as any)?.icon,
        text: this.textContent,
      });
    }
  }
);

describe("showNotification", () => {
  test.each<
    [
      Parameters<typeof showNotification>[0],
      { variant: string; duration: number; icon?: string; text: string }
    ]
  >([
    [
      { type: "success", message: "Done!" },
      {
        variant: "success",
        duration: 3000,
        icon: "check-circle",
        text: "Done!",
      },
    ],
    [
      { type: "error", message: "Oops!" },
      {
        variant: "danger",
        duration: 3000,
        icon: "close-circle",
        text: "Oops!",
      },
    ],
    [
      { type: "warn", message: "Um" },
      {
        variant: "warning",
        duration: 3000,
        icon: "exclamation-circle",
        text: "Um",
      },
    ],
    [
      { type: "info", message: "OK" },
      {
        variant: "primary",
        duration: 3000,
        icon: "info-circle",
        text: "OK",
      },
    ],
  ])("showNotification(%j) should toast with %j", (input, output) => {
    showNotification(input);
    expect(toast).toBeCalledWith(output);
  });
});
