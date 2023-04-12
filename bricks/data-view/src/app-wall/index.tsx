import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./app-wall.shadow.css";
import { AppWallElement } from "./app-wall.js";
import type { AppData, Relation } from "./utils.js";
import { dataSource, relations } from "./mockData.js";

const { defineElement, property } = createDecorators();

export interface AppWallProps {
  dataSource: AppData[];
  relations: Relation[];
}

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
  /**
   * @default
   * @required
   * @description 数据
   */
  @property({
    attribute: false,
  })
  accessor dataSource: AppData[] = dataSource as AppData[];

  /**
   * @default
   * @required
   * @description 关系
   */
  @property({
    attribute: false,
  })
  accessor relations: Relation[] = relations;

  render() {
    return (
      <AppWallElement
        dataSource={this.dataSource}
        relations={this.relations}
      />
    );
  }
}

export { AppWall };
