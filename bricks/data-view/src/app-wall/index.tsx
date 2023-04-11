import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./app-wall.shadow.css";
import { AppWallElement } from "./app-wall.js";

const { defineElement, property } = createDecorators();

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppWallProps { }

/**
 * @id data-view.app-wall
 * @name data-view.app-wall
 * @docKind brick
 * @description 应用墙
 * @author nlicroshan
 * @noInheritDoc
 */
@defineElement("data-view.app-wall", {
  styleTexts: [variablesStyleText, styleText],
})
class AppWall
  extends ReactNextElement
  implements AppWallProps {

  render() {
    return (
      <AppWallElement />
    );
  }
}

export { AppWall };
