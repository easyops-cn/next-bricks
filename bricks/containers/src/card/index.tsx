import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import { isEmpty } from "lodash";
import "@next-core/theme";
import styleText from "./card.shadow.css";
import "./host-context.css";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
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
  bodyStyle?: React.CSSProperties;
  headerIcon?: GeneralIconProps;
  background?: boolean | string;
  compact?: boolean;
  outline?: CardOutline;
  hideSplit?: boolean;
  themeVariant?: "elevo" | "default";
}

export type CardOutline =
  | "border"
  | "shadow"
  | "background"
  | "none"
  | "default";

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");

const { defineElement, property } = createDecorators();

const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * 通用卡片构件
 * @en A general-purpose card brick
 * @author julielai
 * @slot - 卡片内容
 * @slotEn - The card content
 * @slot extra - 头部右侧拓展元素
 * @slotEn extra - Extra elements on the right side of the header
 * @slot titleSuffix - 标题后缀的插槽
 * @slotEn titleSuffix - The slot for the title suffix
 * @category card-info
 */
@defineElement("eo-card", {
  styleTexts: [styleText],
  alias: ["containers.general-card"],
})
class Card extends ReactNextElement implements CardProps {
  /**
   * 标题
   * @en Title
   */
  @property() accessor cardTitle: string | undefined;

  /**
   * 头部图标
   * @en Header icon
   */
  @property({
    attribute: false,
  })
  accessor headerIcon: GeneralIconProps | undefined;

  /**
   * 自动撑满父容器。注意不可以同时使用 `fillVertical` 和 `verticalCenter`
   * @en Automatically fill the parent container. Note that `fillVertical` and `verticalCenter` cannot be used at the same time.
   */
  @property({
    type: Boolean,
    render: false,
  })
  accessor fillVertical: boolean | undefined;

  /**
   * 垂直居中。注意不可以同时使用 `fillVertical` 和 `verticalCenter`
   * @en Vertically centered. Note that `fillVertical` and `verticalCenter` cannot be used at the same time.
   */
  @property({
    type: Boolean,
  })
  accessor verticalCenter: boolean | undefined;

  /**
   * 是否右上角有操作区 slot
   * @en Whether there is an action area slot in the upper right corner
   */
  @property({
    type: Boolean,
  })
  accessor hasExtraSlot: boolean | undefined;

  /**
   * 右上角的操作按钮列表
   * @en List of action buttons in the upper right corner
   */
  @property({ attribute: false })
  accessor operationButtons: OperationButton[] = [];

  /**
   * 头部样式
   * @en Header style
   */
  @property({
    attribute: false,
  })
  accessor headerStyle: React.CSSProperties | undefined;

  /**
   * 内容区域样式
   * @en Content area style
   */
  @property({
    attribute: false,
  })
  accessor bodyStyle: React.CSSProperties | undefined;

  /**
   * 背景设置。传 `false` 可去除背景，传字符串可自定义背景色（如 CSS 颜色值），默认使用标准背景填充色
   * @en Background configuration. Pass `false` to remove the background, or pass a string to customize the background color (such as a CSS color value). The standard background fill color is used by default.
   */
  @property({
    attribute: false,
  })
  accessor background: boolean | string | undefined;

  /**
   * 卡片轮廓。默认情况下，使用默认背景填充色，8.2 下默认则为无描边且无填充。
   * @en Card outline. By default, the standard background fill color is used; in 8.2 it is borderless and unfilled by default.
   *
   * @default "default"
   */
  @property()
  accessor outline: CardOutline | undefined;

  /**
   * 是否隐藏分割线
   * @en Whether to hide the divider
   */
  @property({
    type: Boolean,
  })
  accessor hideSplit: boolean | undefined;

  /**
   * 主题变体，可选 `"default"` 或 `"elevo"`
   * @en Theme variant, either `"default"` or `"elevo"`
   */
  @property()
  accessor themeVariant: "default" | "elevo" | undefined;

  render() {
    return (
      <CardComponent
        cardTitle={this.cardTitle}
        verticalCenter={this.verticalCenter}
        hasExtraSlot={this.hasExtraSlot}
        operationButtons={this.operationButtons}
        headerStyle={this.headerStyle}
        bodyStyle={this.bodyStyle}
        headerIcon={this.headerIcon}
        background={this.background}
      />
    );
  }
}

export function CardComponent({
  cardTitle,
  verticalCenter,
  hasExtraSlot,
  operationButtons,
  headerStyle,
  bodyStyle,
  headerIcon,
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
          {headerIcon && (
            <WrappedGeneralIcon className="header-icon" {...headerIcon} />
          )}
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
    [
      headerIcon,
      headerStyle,
      cardTitle,
      hasExtraSlot,
      operationButtons,
      renderButtons,
    ]
  );

  return (
    <div
      className="card"
      style={{
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
        style={{
          ...(verticalCenter
            ? {
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
            : {}),
          ...bodyStyle,
        }}
      >
        <slot></slot>
      </div>
    </div>
  );
}

export { Card };
