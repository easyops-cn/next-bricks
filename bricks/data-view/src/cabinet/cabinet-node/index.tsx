import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-node.shadow.css";
import classNames from "classnames";
import virtualMachineImg from "./virtualMachine.png";
import physicalMachineImg from "./physicalMachine.png";
import containerGroupImg from "./containerGroup.png";

const imageMap = {
  "container-group": containerGroupImg,
  "virtual-machine": virtualMachineImg,
  "physical-machine": physicalMachineImg,
}

const { defineElement, property } = createDecorators();

export interface CabinetNodeProps {
  type: "container-group" | "physical-machine" | "virtual-machine";
  nodeTitle: string;
  status?: "active" | "faded";
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

  render() {
    return (
      <CabinetNodeElement
        type={this.type}
        nodeTitle={this.nodeTitle}
        status={this.status}
      />
    );
  }
}

function CabinetNodeElement(props: CabinetNodeProps): React.ReactElement {
  const { type, nodeTitle, status } = props;

  return (
    <div className={classNames("container", type && `type-${type}`, status && `status-${status}`)}>
      <img className="image" src={imageMap[type]} alt={type} />
      <div className="node-title" title={nodeTitle}>{nodeTitle}</div>
    </div>
  );
}

export { CabinetNode };
