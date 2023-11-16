import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import { isEmpty } from "lodash";
import styleText from "./card.shadow.css";
import "@next-core/theme";

export interface OperationButton {
  id: string;
  eventName: string;
  configProps: ButtonProps & { icon?: string };
  tooltip?: string;
  text?: string;
  needData?: boolean;
}

export interface CardProps {
  cardTitle?: string;
  fillVertical?: boolean;
  verticalCenter?: boolean;
  hasExtraSlot?: boolean;
  operationButtons?: OperationButton[];
  headerStyle?: React.CSSProperties;
  background?: boolean | string;
  compact?: boolean;
  outline?: CardOutline;
}

export type CardOutline =
  | "border"
  | "shadow"
  | "background"
  | "none"
  | "default";

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");

const { defineElement, property } = createDecorators();

/**
 * 通用卡片构件
 * @author julielai
 * @slot - 卡片内容
 * @slot extra - 头部右侧拓展元素
 * @slot titleSuffix - 标题后缀的插槽
 * @category card-info
 */
@defineElement("eo-card", {
  styleTexts: [styleText],
  alias: ["containers.general-card"],
})
class Card extends ReactNextElement implements CardProps {
  /**
   * 标题
   */
  @property() accessor cardTitle: string | undefined;

  /**
   * 自动撑满父容器
   */
  @property({
    type: Boolean,
  })
  accessor fillVertical: boolean | undefined;

  /**
   * 垂直居中
   */
  @property({
    type: Boolean,
  })
  accessor verticalCenter: boolean | undefined;

  /**
   * 是否右上角有操作区 slot
   */
  @property({
    type: Boolean,
  })
  accessor hasExtraSlot: boolean | undefined;

  /**
   * 右上角的操作按钮列表
   */
  @property({ attribute: false })
  accessor operationButtons: OperationButton[] = [];

  /**
   * 头部样式
   */
  @property({
    attribute: false,
  })
  accessor headerStyle: React.CSSProperties | undefined;

  /**
   * 背景
   */
  @property({
    attribute: false,
  })
  accessor background: boolean | string | undefined;

  /**
   * 卡片轮廓。默认情况下，使用默认背景填充色，8.2 下默认则为无描边且无填充。
   *
   * @default "default"
   */
  @property()
  accessor outline: CardOutline | undefined;

  render() {
    return (
      <CardComponent
        cardTitle={this.cardTitle}
        fillVertical={this.fillVertical}
        verticalCenter={this.verticalCenter}
        hasExtraSlot={this.hasExtraSlot}
        operationButtons={this.operationButtons}
        headerStyle={this.headerStyle}
        background={this.background}
      />
    );
  }
}

export function CardComponent({
  cardTitle,
  fillVertical,
  verticalCenter,
  hasExtraSlot,
  operationButtons,
  headerStyle,
  background = true,
}: CardProps) {
  const renderButtons = useMemo(
    () =>
      operationButtons?.map((button) => {
        return (
          <WrappedButton {...button.configProps} id={button.id} key={button.id}>
            {button.text}
          </WrappedButton>
        );
      }),
    [operationButtons]
  );

  const header = useMemo(
    () => (
      <div className="card-head" style={headerStyle}>
        <div className="card-head-wrapper">
          {cardTitle && (
            <div className="card-head-title">
              {cardTitle}
              <slot name="titleSuffix" />
            </div>
          )}
          {(hasExtraSlot || !isEmpty(operationButtons)) && (
            <div className="card-extra">
              {isEmpty(operationButtons) ? null : renderButtons}
              <slot name="extra"></slot>
            </div>
          )}
        </div>
      </div>
    ),
    [headerStyle, cardTitle, hasExtraSlot, operationButtons, renderButtons]
  );

  return (
    <div
      className="card"
      style={{
        ...(fillVertical ? { height: "100%" } : {}),
        ...(verticalCenter
          ? { display: "grid", gridTemplate: "50px auto/auto" }
          : {}),
        ...(background
          ? { background: typeof background === "string" ? background : "" }
          : { background: "none" }),
      }}
    >
      {(cardTitle || hasExtraSlot) && header}
      <div
        className="card-body"
        style={
          verticalCenter
            ? {
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
            : {}
        }
      >
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  );
}

export { Card };
