import React, {useLayoutEffect, useRef, useState} from "react";
import {ReactNextElement, wrapBrick} from "@next-core/react-element";
import {createDecorators} from "@next-core/element";
import classNames from "classnames";
import {CabinetNode, CabinetNodeProps} from "../cabinet-node/index.js";
import {ContainerType} from "../cabinet-container/index.js";
import variablesText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-thumbnail.shadow.css";
import {usePrevious} from "../../hooks/index.js";

const {defineElement, property} = createDecorators();

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
    columns?: number;
}

/**
 * @id data-view.cabinet-thumbnail
 * @name data-view.cabinet-thumbnail
 * @docKind brick
 * @description 应用墙缩略图
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.cabinet-thumbnail", {
    styleTexts: [variablesText,styleText],
})
class CabinetThumbnail extends ReactNextElement implements CabinetThumbnailProps {
  /**
   * @kind CabinetContainerProps[]
   * @required true
   * @default
   * @description 集群数据
   */
  @property({attribute: false})
  accessor clusters: Clusters[] = [];

    /**
     * @kind number
     * @required
     * @default 4
     * @description 单个容器列数
     */
    @property({type: Number})
    accessor columns:number = 4;

  render(): React.ReactNode {
    return <CabinetThumbnailComponent
        clusters={this.clusters}
        columns={this.columns}
    />;
  }
}

export function CabinetThumbnailComponent(props:CabinetThumbnailProps): React.ReactElement {
    const {clusters, columns} = props;
    const containerRef = useRef<HTMLDivElement>();
    const layoutRef = useRef<HTMLDivElement>();
    const [scale, setScale] = useState<number>();
    const preScale = usePrevious(scale);

    useLayoutEffect(()=>{
        const {width ,height}  = containerRef.current.getBoundingClientRect();
        if(!!clusters.length && columns>0) {
            const {width:realWidth,height: realHeight} = layoutRef.current.getBoundingClientRect();
            // 计算缩放比例
            const wScale = width/(realWidth / (preScale??1));
            const hScale =  height/(realHeight * (preScale??1));
           setScale(Math.min(Math.floor(Math.min(wScale,hScale) *100) / 100, 1));
        }
    },[clusters,preScale,columns])

    return  <div ref={containerRef} className="wrapper">
        <div className="thumbnailLayout"
             style={{
           ...(scale?{transform: `scale(${scale})`}: {})
        }}>
            <div className="layout" ref={layoutRef}>
                {
                    clusters.map((item,index) => (
                        <div className="clusterWrapper" key={index}>
                            <div className={classNames("clusterContainer", {
                                clusterHostContainer: item.type === "host",
                                clusterK8sContainer: item.type === "k8s",
                            })}
                            >
                                <div className="clusterContent">
                                    <div className="clusterContentLayout" style={{gridTemplateColumns: `repeat(${columns},1fr)`}}>
                                        {
                                            item.data.map((node, index) => (
                                                <div key={index} className="itemContent" >
                                                    <WrappedNode type={node.type} nodeTitle={node.nodeTitle}  />
                                                </div>))
                                        }
                                    </div>
                                </div>
                                <div className="clusterTitle">
                                    <div className="title">{item.title}</div>
                                   </div>
                            </div>
                        </div>))
                }
            </div>
        </div>

    </div>

}
export {CabinetThumbnail}
