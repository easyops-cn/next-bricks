import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 构件 `eo-diagram`
 */
export
@defineElement("eo-diagram", {
  styleTexts: [styleText],
})
class EoDiagram extends ReactNextElement {
  render() {
    return <EoDiagramComponent />;
  }
}

// export interface EoDiagramProps {
//   // Define props here.
// }

export function EoDiagramComponent(/* props: EoDiagramProps */) {
  return <div>It works!</div>;
}
