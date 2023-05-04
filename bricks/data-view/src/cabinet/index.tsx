import React, { useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./cabinet.shadow.css";
import classNames from "classnames";
import type {
  CabinetAppLayer,
  CabinetAppLayerProps,
} from "./cabinet-app-layer/index.jsx";
import type {
  CabinetButton,
  CabinetButtonProps,
} from "./cabinet-button/index.jsx";
import type { CabinetNode, CabinetNodeProps } from "./cabinet-node/index.jsx";
import type {
  CabinetContainer,
  CabinetContainerProps,
} from "./cabinet-container/index.jsx";

const WrappedCabinetAppLayer = wrapBrick<CabinetAppLayer, CabinetAppLayerProps>(
  "data-view.cabinet-app-layer"
);
const WrappedCabinetButton = wrapBrick<CabinetButton, CabinetButtonProps>(
  "data-view.cabinet-button"
);
const WrappedCabinetNode = wrapBrick<CabinetNode, CabinetNodeProps>(
  "data-view.cabinet-node"
);
const WrappedCabinetContainer = wrapBrick<
  CabinetContainer,
  CabinetContainerProps
>("data-view.cabinet-container");

const { defineElement, property, event } = createDecorators();

interface Node {
  nodeTitle: string;
  key: string;
  type: "container-group" | "physical-machine" | "virtual-machine";
}

interface Clusters {
  clusterName: string;
  key: string;
  type: "host" | "k8s";
  nodes: Node[];
}

interface AppData {
  appName: string;
  key: string;
  clusters: Clusters[];
}
type ChangeType = "node" | "cluster" | "layer";

export interface CabinetGraphProps {
  dataSource: AppData;
  activeKey?: string;
  onCloseBtnClick?: () => void;
  onActiveKeyChange?: (
    key: string,
    type?: ChangeType,
    data?: Record<string, any>
  ) => void;
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

  /**
   * @kind string
   * @required false
   * @default
   * @description 选中项
   */
  @property()
  accessor activeKey: string;

  /**
   * @detail
   * @description 关闭按钮点击事件
   */
  @event({ type: "close.button.click" })
  accessor #closeBtnClickEvent!: EventEmitter<void>;

  /**
   * @detail
   * @description 节点或者外层的点击的事件
   */
  @event({ type: "cabinet.click" })
  accessor #cabinetClickEvent!: EventEmitter<{
    type: ChangeType;
    data: Record<string, any>;
  }>;

  #handleCloseBtnClick = (): void => {
    this.#closeBtnClickEvent.emit();
  };

  #handleActiveKeyChange = (
    newKey: string,
    type: ChangeType,
    data?: Record<string, any>
  ) => {
    this.activeKey = newKey;
    if (newKey) {
      this.#cabinetClickEvent.emit({
        type,
        data,
      });
    }
  };

  render() {
    return (
      <CabinetGraphElement
        activeKey={this.activeKey}
        dataSource={this.dataSource}
        onCloseBtnClick={this.#handleCloseBtnClick}
        onActiveKeyChange={this.#handleActiveKeyChange}
      />
    );
  }
}

function CabinetGraphElement(props: CabinetGraphProps): React.ReactElement {
  const { dataSource, activeKey, onCloseBtnClick, onActiveKeyChange } = props;

  const dataSourceMap = useMemo(() => {
    const map: Record<string, any> = {
      [dataSource.key]: {
        type: "layer",
        layer: dataSource.key,
        data: dataSource,
      },
    };

    dataSource.clusters.map((clu) => {
      map[clu.key] = {
        type: "cluster",
        layer: dataSource.key,
        cluster: clu.key,
        data: clu,
      };
      clu.nodes.map((node) => {
        map[node.key] = {
          type: "node",
          layer: dataSource.key,
          cluster: clu.key,
          node: node.key,
          data: node,
        };
      });
    });

    return map;
  }, [dataSource]);

  const activeData = useMemo(() => {
    return dataSourceMap[activeKey] || {};
  }, [dataSourceMap, activeKey]);

  return (
    <div
      className="wrapper"
      onClick={(e) => {
        onActiveKeyChange(null);
      }}
    >
      <div className="container">
        <WrappedCabinetAppLayer
          className="app-layer"
          appTitle={dataSource.appName}
          onClick={(e) => {
            e.stopPropagation();
            onActiveKeyChange(dataSource.key, "layer");
          }}
          status={
            activeData.type === "layer" && activeData.layer == dataSource.key
              ? "active"
              : undefined
          }
        />
        <div
          className="cluster-container"
          style={{
            gridTemplateColumns: `repeat(${dataSource.clusters.length}, 1fr)`,
          }}
        >
          {dataSource.clusters.map((clu) => {
            return (
              <WrappedCabinetContainer
                key={clu.key}
                type={clu.type}
                customTitle={clu.clusterName}
                data={clu.nodes.map((node) => ({
                  nodeTitle: node.nodeTitle,
                  type: node.type,
                  key: node.key,
                  status: (() => {
                    switch (activeData.type) {
                      case "cluster": {
                        return activeData.cluster === clu.key
                          ? undefined
                          : "faded";
                      }
                      case "node": {
                        return activeData.node === node.key
                          ? "active"
                          : "faded";
                      }
                      default:
                        return undefined;
                    }
                  })(),
                }))}
                handleClick={({ type, data }) => {
                  switch (type) {
                    case "container": {
                      onActiveKeyChange(clu.key, "cluster", clu);
                      break;
                    }
                    case "node": {
                      onActiveKeyChange((data as any).key, "node", data);
                      break;
                    }
                  }
                }}
                status={(() => {
                  switch (activeData.type) {
                    case "cluster": {
                      return activeData.cluster === clu.key
                        ? "active"
                        : "faded";
                    }
                    case "node": {
                      return activeData.cluster === clu.key
                        ? undefined
                        : "faded";
                    }
                    default:
                      return undefined;
                  }
                })()}
              />
            );
          })}
        </div>
        <WrappedCabinetButton
          className="close-button"
          onClick={(e) => {
            e.stopPropagation();
            onCloseBtnClick?.();
          }}
        />
      </div>
    </div>
  );
}

export { CabinetGraph };
