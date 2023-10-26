import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-app-layer.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

export interface CabinetAppLayerProps {
  appTitle: string;
  status?: "active" | "faded";
}

/**
 * cabinet子构件----应用层
 * @author nlicroshan
 */
@defineElement("data-view.cabinet-app-layer", {
  styleTexts: [variablesStyleText, styleText],
})
class CabinetAppLayer extends ReactNextElement implements CabinetAppLayerProps {
  /**
   * @kind string
   * @required true
   * @default
   * @description 标题
   */
  @property()
  accessor appTitle: string;

  /**
   * @kind "active" | "faded"
   * @required false
   * @default
   * @description 当前状态
   */
  @property()
  accessor status: "active" | "faded";

  render() {
    return (
      <CabinetAppLayerElement appTitle={this.appTitle} status={this.status} />
    );
  }
}

function CabinetAppLayerElement(
  props: CabinetAppLayerProps
): React.ReactElement {
  const { appTitle, status } = props;

  return (
    <div className={classNames("container", status && `status-${status}`)}>
      <div className="app-title" title={appTitle}>
        {appTitle}
      </div>
      <div className="divider" />
    </div>
  );
}

export { CabinetAppLayer };
