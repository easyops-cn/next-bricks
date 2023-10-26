import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./app-wall.shadow.css";
import { AppWallElement } from "./app-wall.js";
import type { AppData, Relation } from "./utils.js";
import { AppWallCardBrickNameType, CardSize } from "./interface.js";

const { defineElement, property, event } = createDecorators();

export interface AppWallProps {
  cardSize: CardSize;
  dataSource: AppData[];
  relations: Relation[];
  useDblclick?: boolean;
  useDistanceConfig?: boolean;
  onSystemCardButtonClick?: (data: AppData) => void;
  leftBtnOnClick?: (data: AppData) => void;
  rightBtnOnClick?: (data: AppData) => void;
  handleCardDbClick?: (data: AppData) => void;
  disabledDefaultClickEvent?: boolean;
  handleCardClick?: (data: AppData) => void;
  cardBrickName: AppWallCardBrickNameType; // 支持更多种类，需要在dependencies内增加引入增加的类型
  containerId?: string;
}

/**
 * 应用墙
 * @author nlicroshan
 */
@defineElement("data-view.app-wall", {
  styleTexts: [variablesStyleText, styleText],
  dependencies: [
    "data-view.app-wall-card-item",
    "data-view.cabinet-thumbnail",
    "data-view.simple-card-item",
  ],
})
class AppWall extends ReactNextElement implements AppWallProps {
  /**
   *  数据
   */
  @property({
    attribute: false,
  })
  accessor dataSource: AppData[];

  /**
   *  关系
   */
  @property({
    attribute: false,
  })
  accessor relations: Relation[];

  /**
   *  是否使用双击事件，开启之后卡片不会触发内部dblclick事件展示梯台
   */
  @property({
    attribute: false,
  })
  accessor useDblclick: boolean;

  /**
   * 是否使用内置的distanceConfig配置
   */
  @property({
    attribute: false,
  })
  accessor useDistanceConfig: boolean;

  /**
   *  是否禁用触发默认单击事件，开启之后卡片不会触发内部click事件展示卡片，直接跑出了点击事件
   */
  @property({
    attribute: false,
  })
  accessor disabledDefaultClickEvent: boolean;

  /**
   *  卡的大小配置，注意这里卡片大小宽高将影响T台大小展示
   */
  @property({
    attribute: false,
  })
  accessor cardSize: CardSize = {
    width: 120,
    height: 160,
    outerWidth: 140,
    outerHeight: 180,
    lgWidth: 180,
    lgHeight: 240,
  };

  /**
   *  卡片支持的构件类型
   */
  @property({
    attribute: false,
  })
  accessor cardBrickName: AppWallCardBrickNameType =
    "data-view.app-wall-card-item";

  /**
   *  容器id，用于监听容器大小
   */
  @property()
  accessor containerId: string;

  /**
   *  详情卡片点击事件
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

  /**
   * @detail
   * @description 卡片双击事件,useDblclick:true 或者当前节点clusters属性无数据的时候也会触发
   */
  @event({ type: "on.card.dbclick" })
  accessor #onDbClickEvent!: EventEmitter<AppData>;

  /**
   * @detail
   * @description 卡片单击事件, disabledDefaultClickEvent:true 点击卡片触发
   */
  @event({ type: "card.click" })
  accessor #onClickEvent!: EventEmitter<AppData>;

  handleLeftClick = (data: AppData) => {
    this.#onLeftClickEvent.emit(data);
  };
  handleRightClick = (data: AppData) => {
    this.#onRightClickEvent.emit(data);
  };
  handleCardDbClick = (data: AppData) => {
    this.#onDbClickEvent.emit(data);
  };
  handleCardClick = (data: AppData) => {
    this.#onClickEvent.emit(data);
  };

  render() {
    return (
      <AppWallElement
        dataSource={this.dataSource}
        relations={this.relations}
        onSystemCardButtonClick={this.#handleSystemCardButtonClick}
        useDblclick={this.useDblclick}
        useDistanceConfig={this.useDistanceConfig}
        leftBtnOnClick={this.handleLeftClick}
        rightBtnOnClick={this.handleRightClick}
        handleCardDbClick={this.handleCardDbClick}
        disabledDefaultClickEvent={this.disabledDefaultClickEvent}
        handleCardClick={this.handleCardClick}
        cardSize={this.cardSize}
        cardBrickName={this.cardBrickName}
        containerId={this.containerId}
      />
    );
  }
}

export { AppWall };
