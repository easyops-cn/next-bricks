import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-menu-group`
 */
export
@defineElement("eo-menu-group", {
  styleTexts: [styleText],
})
class EoMenuGroup extends ReactNextElement {
  render() {
    return <EoMenuGroupComponent />;
  }
}

export function EoMenuGroupComponent() {
  return (
    <div part="menu-group">
      <div part="menu-group-title" className="menu-group-title">
        <slot name="title" />
      </div>

      <slot />
    </div>
  );
}
