import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";

const { defineElement } = createDecorators();

/**
 * 构件 `illustrations.rocket-transition`
 */
export
@defineElement("illustrations.rocket-transition", {
  styleTexts: [styleText],
})
class RocketTransition extends ReactNextElement {
  render() {
    return <RocketTransitionComponent />;
  }
}

export function RocketTransitionComponent() {
  return (
    <>
      <div className="bg"></div>
      <div className="rocket">
        <div className="ring">
          <div className="ball-1"></div>
          <div className="ball-2"></div>
        </div>
      </div>
      <div className="diamond-1"></div>
      <div className="diamond-2"></div>
      <div className="diamond-3"></div>
    </>
  );
}
