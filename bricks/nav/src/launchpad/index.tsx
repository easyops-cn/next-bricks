import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { LaunchpadButton as LaunchpadButtonComponent } from "./LaunchpadButton/LaunchpadButton.js";
import { initializeReactI18n } from "@next-core/i18n/react";
import "@next-core/theme";
import { NS, locales } from "./i18n.js";
import styleText from "./LaunchpadButton/LaunchpadButton.shadow.css";

initializeReactI18n(NS, locales);

const { defineElement } = createDecorators();

/**
 * Launchpad 按钮构件
 * @author sailor
 * @insider
 */
@defineElement("eo-launchpad-button", {
  styleTexts: [styleText],
})
class LaunchpadButton extends ReactNextElement {
  render() {
    return <LaunchpadButtonComponent />;
  }
}

export { LaunchpadButton };
