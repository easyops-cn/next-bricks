import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./cabinet.shadow.css";
import classNames from "classnames";
import type { CabinetAppLayer, CabinetAppLayerProps } from "./cabinet-app-layer/index.jsx";
import type { CabinetButton, CabinetButtonProps } from "./cabinet-button/index.jsx";
import type { CabinetNode, CabinetNodeProps } from "./cabinet-node/index.jsx";
import type { CabinetContainer, CabinetContainerProps } from "./cabinet-container/index.jsx";

const WrappedCabinetAppLayer = wrapBrick<CabinetAppLayer, CabinetAppLayerProps>(
  "data-view.cabinet-app-layer"
);
const WrappedCabinetButton = wrapBrick<CabinetButton, CabinetButtonProps>(
  "data-view.cabinet-button"
);
const WrappedCabinetNode = wrapBrick<CabinetNode, CabinetNodeProps>(
  "data-view.cabinet-node"
);
const WrappedCabinetContainer = wrapBrick<CabinetContainer, CabinetContainerProps>(
  "data-view.cabinet-container"
);

const { defineElement, property } = createDecorators();

interface Node {
  nodeTitle: string,
  key: string,
  type: "container-group" | "physical-machine" | "virtual-machine",
}

interface Clusters {
  clusterName: string,
  key: string,
  type: "host" | "k8s",
  nodes: Node[],
}

interface AppData {
  appName: string;
  key: string,
  clusters: Clusters[],
}

export interface CabinetGraphProps {
  dataSource: AppData,
}

/**
 * @id data-view.cabinet-graph
 * @name data-view.cabinet-graph
 * @docKind brick
 * @description cabinet构件
 * @author nlicroshan
 * @noInheritDoc
 */
@defineElement("data-view.cabinet-graph", {
  styleTexts: [variablesStyleText, styleText],
})
class CabinetGraph extends ReactNextElement implements CabinetGraphProps {
  /**
  * @kind AppData
  * @required true
  * @default
  * @description 数据源
  */
  @property({
    attribute: false,
  })
  accessor dataSource: AppData;

  render() {
    return (
      <CabinetGraphElement
        dataSource={this.dataSource}
      />
    );
  }
}

function CabinetGraphElement(props: CabinetGraphProps): React.ReactElement {
  const { dataSource } = props;

  return (
    <div >
      <WrappedCabinetAppLayer appTitle={dataSource.appName} />
      <div className="cluster-container">
        {dataSource.clusters.map(v => {
          return <WrappedCabinetContainer key={v.key}
            type={v.type} customTitle={v.clusterName}
            data={v.nodes.map(v => ({ nodeTitle: v.nodeTitle, type: v.type }))}
          />
        })}
      </div>
    </div>
  );
}

export { CabinetGraph };
