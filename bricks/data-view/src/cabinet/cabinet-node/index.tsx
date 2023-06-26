import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-node.shadow.css";
import classNames from "classnames";
import virtualMachineImg from "../../asset/images/virtualMachine.png";
import physicalMachineImg from "../../asset/images/physicalMachine.png";
import containerGroupImg from "../../asset/images/containerGroup.png";
import virtualMachineWarningImg from "../../asset/images/virtualMachineWarning.png";
import physicalMachineWarningImg from "../../asset/images/physicalMachineWarning.png";
import containerGroupWarningImg from "../../asset/images/containerGroupWarning.png";

const imageMap = {
  "container-group": containerGroupImg,
  "virtual-machine": virtualMachineImg,
  "physical-machine": physicalMachineImg,
  "container-group-warning": containerGroupWarningImg,
  "virtual-machine-warning": virtualMachineWarningImg,
  "physical-machine-warning": physicalMachineWarningImg,
};

const { defineElement, property } = createDecorators();

export interface CabinetNodeProps {
  type: "container-group" | "physical-machine" | "virtual-machine";
  nodeTitle: string;
  status?: "active" | "faded";
  isAlert?: boolean;
}

/**
 * @id data-view.cabinet-node
 * @name data-view.cabinet-node
 * @docKind brick
 * @description cabinet子构件----节点
 * @author nlicroshan
 * @noInheritDoc
 */
@defineElement("data-view.cabinet-node", {
  styleTexts: [variablesStyleText, styleText],
})
class CabinetNode extends ReactNextElement implements CabinetNodeProps {
  /**
   * @kind "container-group" | "physical-machine" | "virtual-machine"
   * @required true
   * @default
   * @description 类型
   */
  @property()
  accessor type: "container-group" | "physical-machine" | "virtual-machine";

  /**
   * @kind string
   * @required true
   * @default
   * @description 标题
   */
  @property()
  accessor nodeTitle: string;

  /**
   * @kind "active" | "faded"
   * @required false
   * @default
   * @description 当前状态
   */
  @property()
  accessor status: "active" | "faded";

  /**
   * @kind boolean
   * @required false
   * @default
   * @description 是否是告警态
   */
  @property({ type: Boolean })
  accessor isAlert: boolean;

  render() {
    return (
      <CabinetNodeElement
        type={this.type}
        nodeTitle={this.nodeTitle}
        status={this.status}
        isAlert={this.isAlert}
      />
    );
  }
}

function CabinetNodeElement(props: CabinetNodeProps): React.ReactElement {
  const { type, nodeTitle, status, isAlert } = props;

  return (
    <div
      className={classNames(
        "container",
        type && `type-${type}`,
        status && `status-${status}`
      )}
    >
      <img
        className="image"
        src={imageMap[`${type}${isAlert ? "-warning" : ""}`]}
        alt={type}
      />
      <div className="node-title" title={nodeTitle}>
        {nodeTitle}
      </div>
    </div>
  );
}

export { CabinetNode };
