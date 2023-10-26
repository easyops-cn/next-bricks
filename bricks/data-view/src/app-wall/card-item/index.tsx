import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./card-item.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

export interface AppWallCardItemProps {
  status?: "normal" | "warning";
  cardTitle: string;
  description: string;
}

/**
 * 应用墙子构件----卡片项
 * @author nlicroshan
 */
@defineElement("data-view.app-wall-card-item", {
  styleTexts: [variablesStyleText, styleText],
})
class AppWallCardItem extends ReactNextElement implements AppWallCardItemProps {
  /**
   *  状态
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

  render() {
    return (
      <AppWallCardItemElement
        status={this.status}
        cardTitle={this.cardTitle}
        description={this.description}
      />
    );
  }
}

function AppWallCardItemElement(
  props: AppWallCardItemProps
): React.ReactElement {
  const { status, cardTitle, description } = props;

  return (
    <div
      className={classNames(
        "card-item-container",
        status && `status-${status}`
      )}
    >
      <div className="card-item">
        <div className="card-item-text-container">
          <div className="card-item-title">{cardTitle}</div>
          <div className="card-item-description">{description}</div>
        </div>
      </div>
    </div>
  );
}

export { AppWallCardItem };
