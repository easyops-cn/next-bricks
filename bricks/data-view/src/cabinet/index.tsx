import React, { useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./cabinet.shadow.css";
import type {
  CabinetAppLayer,
  CabinetAppLayerProps,
} from "./cabinet-app-layer/index.jsx";
import type {
  CabinetButton,
  CabinetButtonProps,
} from "./cabinet-button/index.jsx";
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

export interface AppData {
  appName: string;
  key: string;
  clusters: Clusters[];
}
type ChangeType = "node" | "cluster" | "layer";

export interface CabinetGraphProps {
  dataSource: AppData;
  activeKey?: string | string[];
  hiddenCloseBtn?: boolean;
  onCloseBtnClick?: () => void;
  onActiveKeyChange?: (
    key: string,
    type?: ChangeType,
    data?: Record<string, any>
  ) => void;
  handleDbClick?: (
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
   * @kind string |string[]
   * @required false
   * @default
   * @description 选中项， 支持数组
   */
  @property({ attribute: false })
  accessor activeKey: string | string[];

  /**
   * @kind boolean
   * @required false
   * @default true
   * @description 取消按钮是否需要展示
   */
  @property({ type: Boolean })
  accessor hiddenCloseBtn: boolean;

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

  /**
   * @detail
   * @description 节点或者外层的双击的事件，目前不支持应用层
   */
  @event({ type: "cabinet.dbclick" })
  accessor #cabinetDbClickEvent!: EventEmitter<{
    type: ChangeType;
    data: Record<string, any>;
  }>;

  #handleCloseBtnClick = (): void => {
    this.#closeBtnClickEvent.emit();
  };
  #handleDbClick = (
    newKey: string,
    type: ChangeType,
    data?: Record<string, any>
  ): void => {
    this.activeKey = newKey;
    if (newKey) {
      this.#cabinetDbClickEvent.emit({
        type,
        data,
      });
    }
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
        handleDbClick={this.#handleDbClick}
        hiddenCloseBtn={this.hiddenCloseBtn}
      />
    );
  }
}

function CabinetGraphElement(props: CabinetGraphProps): React.ReactElement {
  const {
    dataSource,
    activeKey,
    onCloseBtnClick,
    onActiveKeyChange,
    handleDbClick,
    hiddenCloseBtn,
  } = props;
  const activeKeys = useMemo(() => {
    return [].concat(activeKey);
  }, [activeKey]);
  //过滤 activeKey 有效数据 & 已经去除layer层的高亮数据，由于layer 高亮，所有都需要展示
  const filterKeys = useMemo(() => {
    const keys: string[] = [];
    dataSource.clusters.map((clu) => {
      if (activeKeys.includes(clu.key)) {
        keys.push(clu.key);
      }
      clu.nodes.map((node) => {
        if (activeKeys.includes(node.key)) {
          keys.push(node.key);
        }
      });
    });
    return keys;
  }, [dataSource, activeKeys]);

  return (
    <div
      className="wrapper"
      onClick={() => {
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
          status={activeKeys.includes(dataSource.key) ? "active" : undefined}
        />
        <div
          className="cluster-container"
          style={{
            gridTemplateColumns: `repeat(${dataSource.clusters.length}, 1fr)`,
          }}
        >
          {dataSource.clusters.map((clu) => {
            const includeClu = filterKeys.includes(clu.key);
            return (
              <WrappedCabinetContainer
                key={clu.key}
                type={clu.type}
                className="cluster-content"
                customTitle={clu.clusterName}
                data={clu.nodes.map((node) => {
                  const includeNode = filterKeys.includes(node.key);
                  return {
                    nodeTitle: node.nodeTitle,
                    type: node.type,
                    key: node.key,
                    status:
                      includeNode || includeClu
                        ? includeClu
                          ? undefined
                          : "active"
                        : filterKeys.length
                        ? "faded"
                        : undefined,
                  };
                })}
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
                  const includeNode = clu.nodes.some((node) =>
                    filterKeys.includes(node.key)
                  );
                  return includeNode || includeClu
                    ? includeClu
                      ? "active"
                      : undefined
                    : filterKeys.length
                    ? "faded"
                    : undefined;
                })()}
                handleDbClick={({ type, data }) => {
                  switch (type) {
                    case "container": {
                      handleDbClick(clu.key, "cluster", clu);
                      break;
                    }
                    case "node": {
                      handleDbClick((data as any).key, "node", data);
                      break;
                    }
                  }
                }}
              />
            );
          })}
        </div>
        {!hiddenCloseBtn && (
          <WrappedCabinetButton
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              onCloseBtnClick?.();
            }}
          />
        )}
      </div>
    </div>
  );
}

export { CabinetGraph };
