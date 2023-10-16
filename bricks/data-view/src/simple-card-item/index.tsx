import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

interface descriptionListItem {
  key: string;
  value: string;
}
export interface SimpleCardItemProps {
  cardTitle: string;
  description: string;
  status?: "normal" | "warning";
  color?: React.CSSProperties["color"];
  background?: React.CSSProperties["background"];
  descriptionList?: descriptionListItem[];
}

/**
 * 构件 `data-view.simple-card-item`
 */
export
@defineElement("data-view.simple-card-item", {
  styleTexts: [styleText],
})
class SimpleCardItem extends ReactNextElement {
  /**
   * 状态
   */
  @property()
  accessor status: "normal" | "warning" = "normal";

  /**
   *  标题
   */
  @property()
  accessor cardTitle: string;

  /**
   * 描述
   */
  @property()
  accessor description: string;

  /**
   * 字体颜色
   */
  @property({ attribute: false })
  accessor color: React.CSSProperties["color"];
  /**
   * 字体颜色
   */
  @property({ attribute: false })
  accessor descriptionList: descriptionListItem[];

  /**
   * 背景颜色
   */
  @property({ attribute: false })
  accessor background: React.CSSProperties["background"];
  render() {
    return (
      <SimpleCardItemComponent
        cardTitle={this.cardTitle}
        description={this.description}
        status={this.status}
        background={this.background}
        color={this.color}
        descriptionList={this.descriptionList}
      />
    );
  }
}

export function SimpleCardItemComponent(props: SimpleCardItemProps) {
  const { status, cardTitle, description, background, color, descriptionList } =
    props;
  return (
    <div
      className={classNames(
        "card-item-container",
        status && `status-${status}`
      )}
      style={{
        background,
        color,
      }}
    >
      <div className="card-item">
        <div className="card-item-text-container">
          {cardTitle && <div className="card-item-title">{cardTitle}</div>}
          {description && (
            <div className="card-item-description">{description}</div>
          )}
          {descriptionList?.length && (
            <div className="card-item-description-list">
              {descriptionList.map((item, index) => (
                <div key={index}>
                  <span>{item.key}：</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
