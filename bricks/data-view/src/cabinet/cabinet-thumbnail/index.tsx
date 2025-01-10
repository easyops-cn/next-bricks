import React, { useLayoutEffect, useRef, useState } from "react";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { createDecorators } from "@next-core/element";
import classNames from "classnames";
import { CabinetNode, CabinetNodeProps } from "../cabinet-node/index.js";
import { ContainerType } from "../cabinet-container/index.js";
import variablesText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-thumbnail.shadow.css";
import { usePrevious } from "../../hooks/index.js";
import {
  CabinetAppLayer,
  CabinetAppLayerProps,
} from "../cabinet-app-layer/index.js";
const WrappedCabinetAppLayer = wrapBrick<CabinetAppLayer, CabinetAppLayerProps>(
  "data-view.cabinet-app-layer"
);
const { defineElement, property } = createDecorators();

const WrappedNode = wrapBrick<CabinetNode, CabinetNodeProps>(
  "data-view.cabinet-node"
);
export interface Clusters {
  data: CabinetNodeProps[];
  type?: ContainerType;
  title?: string | undefined;
}

export interface CabinetThumbnailProps {
  clusters: Clusters[];
  appName: string;
  columns?: number;
}

/**
 * 应用墙缩略图
 * @author astrid
 */
@defineElement("data-view.cabinet-thumbnail", {
  styleTexts: [variablesText, styleText],
})
class CabinetThumbnail
  extends ReactNextElement
  implements CabinetThumbnailProps
{
  /**
   * @kind CabinetContainerProps[]
   * @required true
   * @default
   * @description 集群数据
   */
  @property({ attribute: false })
  accessor clusters: Clusters[] = [];

  /**
   * @kind number
   * @required
   * @default 4
   * @description 单个容器列数
   */
  @property({ type: Number })
  accessor columns: number = 4;

  /**
   * @kind string
   * @required true
   * @default
   * @description 应用名称
   */
  @property()
  accessor appName: string;

  render(): React.ReactNode {
    return (
      <CabinetThumbnailComponent
        clusters={this.clusters}
        columns={this.columns}
        appName={this.appName}
      />
    );
  }
}

export function CabinetThumbnailComponent(
  props: CabinetThumbnailProps
): React.ReactElement {
  const { clusters, columns, appName } = props;
  const containerRef = useRef<HTMLDivElement>(undefined);
  const layoutRef = useRef<HTMLDivElement>(undefined);
  const [scale, setScale] = useState<number>();
  const preScale = usePrevious(scale);

  useLayoutEffect(() => {
    if (!!clusters.length && columns > 0) {
      // 计算缩放比例
      const wScale =
        containerRef.current.clientWidth /
        (layoutRef.current.clientWidth / (preScale ?? 1));
      const hScale =
        containerRef.current.clientHeight /
        (layoutRef.current.clientHeight * (preScale ?? 1));
      setScale(Math.min(Math.floor(Math.min(wScale, hScale) * 100) / 100, 1));
    }
  }, [clusters, preScale, columns]);

  return (
    <div ref={containerRef} className="wrapper">
      <div
        className="thumbnailLayout"
        ref={layoutRef}
        style={{
          ...(scale ? { transform: `scale(${scale})` } : {}),
        }}
      >
        <WrappedCabinetAppLayer className="appLayer" appTitle={appName} />
        <div className="layout">
          {clusters.map((item, index) => (
            <div className="clusterWrapper" key={index}>
              <div
                className={classNames("clusterContainer", {
                  clusterHostContainer:
                    item.type === "host" || item.type === "k8s-blue",
                  clusterK8sContainer: item.type === "k8s",
                })}
              >
                <div className="clusterContent">
                  <div
                    className="clusterContentLayout"
                    style={{ gridTemplateColumns: `repeat(${columns},1fr)` }}
                  >
                    {item.data.map((node, index) => (
                      <div key={index} className="itemContent">
                        <WrappedNode
                          type={node.type}
                          nodeTitle={node.nodeTitle}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="clusterTitle">
                  <div className="title">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export { CabinetThumbnail };
