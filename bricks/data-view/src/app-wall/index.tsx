import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./app-wall.shadow.css";
import { AppWallElement } from "./app-wall.js";
import type { AppData, Relation } from "./utils.js";

const { defineElement, property, event } = createDecorators();

export interface AppWallProps {
  dataSource: AppData[];
  relations: Relation[];
  onSystemCardButtonClick?: (data: AppData) => void;
  leftBtnOnClick?: (data: AppData) => void;
  rightBtnOnClick?: (data: AppData) => void;
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
  dependencies: ["data-view.app-wall-card-item", "data-view.app-wall-relation-line", "data-view.app-wall-system-card"],
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
  accessor dataSource: AppData[];

  /**
   * @default
   * @required
   * @description 关系
   */
  @property({
    attribute: false,
  })
  accessor relations: Relation[];

  /**
  * @detail AppData
  * @description 详情卡片点击事件
  */
  @event({ type: "system.card.button.click" })
  accessor #systemCardButtonClickEvent!: EventEmitter<AppData>;

  #handleSystemCardButtonClick = (data: AppData): void => {
    this.#systemCardButtonClickEvent.emit(data);
  };
  /**
   * @detail
   * @description 展示台左边按钮点击
   */
  @event({ type: "left.btn.click" })
  accessor #onLeftClickEvent!: EventEmitter<AppData>;

  /**
   * @detail
   * @description 展示台左边按钮点击
   */
  @event({ type: "right.btn.click" })
  accessor #onRightClickEvent!: EventEmitter<AppData>;

  handleLeftClick = (data: AppData) => {
    this.#onLeftClickEvent.emit(data);
  }
  handleRightClick = (data: AppData) => {
    this.#onRightClickEvent.emit(data);
  }


  render() {
    return (
      <AppWallElement
        dataSource={this.dataSource}
        relations={this.relations}
        onSystemCardButtonClick={this.#handleSystemCardButtonClick}
        leftBtnOnClick={this.handleLeftClick}
        rightBtnOnClick={this.handleRightClick}
      />
    );
  }
}

export { AppWall };
