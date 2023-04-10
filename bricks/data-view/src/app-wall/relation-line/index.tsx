import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./relation-line.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

export interface AppWallRelationLineProps {
  lightColor: "blue" | "purple";
}

/**
 * @id data-view.app-wall-relation-line
 * @name data-view.app-wall-relation-line
 * @docKind brick
 * @description 应用墙子构件----关联连线
 * @author nlicroshan
 * @noInheritDoc
 */
@defineElement("data-view.app-wall-relation-line", {
  styleTexts: [variablesStyleText, styleText],
})
class AppWallRelationLine extends ReactNextElement implements AppWallRelationLineProps {
  /**
  * @kind "blue" | "purple"
  * @required false
  * @default "blue"
  * @description 光线颜色
  */
  @property()
  accessor lightColor: "blue" | "purple" = "blue";

  render() {
    return (
      <AppWallRelationLineElement
        lightColor={this.lightColor}
      />
    );
  }
}

function AppWallRelationLineElement(props: AppWallRelationLineProps): React.ReactElement {
  const { lightColor } = props;

  return (
    <div className={classNames("relation-line", lightColor && `light-color-${lightColor}`)} />
  );
}

export { AppWallRelationLine };
