import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);

const { defineElement, property } = createDecorators();

/**
 * 构件 `data-view.simple-view`
 */
export
@defineElement("data-view.simple-view", {
  styleTexts: [styleText],
})
class SimpleView extends ReactNextElement {
  render() {
    return (
      <SimpleViewComponent />
    );
  }
}

export function SimpleViewComponent() {
  // const { t } = useTranslation(NS);
  // const hello = t(K.HELLO);
  return <div className="wrapper">
    <slot className="titleBar" name="titleBar" ></slot>
    <slot className="content" name="content" ></slot>
  </div>;
}
