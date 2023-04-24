import React, { Ref, createRef, forwardRef, useImperativeHandle, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
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

const { defineElement, property, method, event } = createDecorators();

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

interface ActiveData { type?: "layer" | "cluster" | "node", keys?: { layer?: string, cluster?: string, node?: string } }

export interface CabinetGraphProps {
  dataSource: AppData,
  onCloseBtnClick?: () => void;
}

export interface CabinetGraphElementRef {
  setActiveData: (data?: ActiveData) => void;
}

const CabinetGraphElement = forwardRef(
  function LegacyCabinetGraphElement(props: CabinetGraphProps, ref: Ref<CabinetGraphElementRef>): React.ReactElement {
    const { dataSource, onCloseBtnClick } = props;
    const [active, setActive] = useState<ActiveData>({});

    useImperativeHandle(ref, () => ({
      setActiveData: setActive,
    }));

    return (
      <div className="wrapper" onClick={(e) => {
        setActive({});
      }}>
        <div className="container">
          <WrappedCabinetAppLayer className="app-layer" appTitle={dataSource.appName}
            onClick={(e) => {
              e.stopPropagation();
              setActive({
                type: "layer",
                keys: {
                  layer: dataSource.key,
                }
              });
            }}
            status={active.type === "layer" && active.keys.layer == dataSource.key ? "active" : undefined}
          />
          <div className="cluster-container" style={{ gridTemplateColumns: `repeat(${dataSource.clusters.length}, 1fr)` }}>
            {dataSource.clusters.map(clu => {
              return <WrappedCabinetContainer key={clu.key} type={clu.type} customTitle={clu.clusterName}
                data={clu.nodes.map(node => ({
                  nodeTitle: node.nodeTitle, type: node.type, key: node.key,
                  status: (() => {
                    switch (active.type) {
                      case "cluster": {
                        return active.keys.cluster === clu.key ? undefined : "faded";
                      }
                      case "node": {
                        return active.keys.node === node.key ? "active" : "faded";
                      }
                      default:
                        return undefined;
                    }
                  })()
                }))}
                handleClick={({ type, data }) => {
                  switch (type) {
                    case "container": {
                      setActive({
                        type: "cluster",
                        keys: {
                          layer: dataSource.key,
                          cluster: clu.key
                        }
                      });
                      break;
                    }
                    case "node": {
                      setActive({
                        type: "node",
                        keys: {
                          layer: dataSource.key,
                          cluster: clu.key,
                          node: (data as any).key,
                        }
                      });
                      break;
                    }
                  }
                }}
                status={(() => {
                  switch (active.type) {
                    case "cluster": {
                      return active.keys.cluster === clu.key ? "active" : "faded";
                    }
                    case "node": {
                      return active.keys.cluster === clu.key ? undefined : "faded";
                    }
                    default:
                      return undefined;
                  }
                })()}
              />
            })}
          </div>
          <WrappedCabinetButton className="close-button" onClick={(e) => {
            e.stopPropagation();
            onCloseBtnClick?.();
          }} />
        </div>
      </div>
    );
  }
);

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
  #cabinetGraphRef = createRef<CabinetGraphElementRef>();
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

  /**
  * @detail
  * @description 关闭按钮点击事件
  */
  @event({ type: "close.button.click" })
  accessor #closeBtnClickEvent!: EventEmitter<void>;

  #handleCloseBtnClick = (): void => {
    this.#closeBtnClickEvent.emit();
  };

  /**
   * @description 修改选中数据
   */
  @method()
  setActiveData(data?: ActiveData) {
    this.#cabinetGraphRef.current?.setActiveData(data);
  }

  render() {
    return (
      <CabinetGraphElement
        ref={this.#cabinetGraphRef}
        dataSource={this.dataSource}
        onCloseBtnClick={this.#handleCloseBtnClick}
      />
    );
  }
}

export { CabinetGraph };
