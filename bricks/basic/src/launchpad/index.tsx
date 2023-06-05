import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { LaunchpadButton as LaunchpadButtonComponent } from "./LaunchpadButton/LaunchpadButton.js";
import styleText from "./LaunchpadButton/LaunchpadButton.shadow.css";
import "@next-core/theme";

const { defineElement } = createDecorators();

/**
 * launchpad按钮构件
 * @author sailor
 */
@defineElement("basic.launchpad-button", {
  styleTexts: [styleText],
})
class LaunchpadButton extends ReactNextElement {
  render() {
    return <LaunchpadButtonComponent />;
  }
}

export { LaunchpadButton };
