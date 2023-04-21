import React, {useMemo} from "react";
import {ReactNextElement, wrapBrick} from "@next-core/react-element";
import {createDecorators} from "@next-core/element";
import variablesText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-container.shadow.css";
import classNames from "classnames";
import {CabinetNodeProps, CabinetNode} from "../cabinet-node/index.js";
import {useResizeObserver} from "../../hooks/index.js";


const {defineElement, property} = createDecorators();
type ContainerType = "host" | "k8s";
const WrappedNode = wrapBrick<CabinetNode, CabinetNodeProps>(
    "data-view.cabinet-node"
);

interface CabinetContainerProps {
    data: CabinetNodeProps[];
    type?: ContainerType;
    customTitle?: string | undefined;
    status?: "active" | "faded";

}

/**
 * @id data-view.cabinet-container
 * @name data-view.cabinet-container
 * @docKind brick
 * @description 大屏集群容器构件
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.cabinet-container", {
    styleTexts: [variablesText, styleText],
})
class CabinetContainer extends ReactNextElement implements CabinetContainerProps {
    /**
     * @kind ContainerType
     * @required true
     * @default  host
     * @description 容器类型，有主机集群类型、k8s集群类型
     */
    @property({attribute: false})
    accessor type: ContainerType = "host";

    /**
     * @kind CabinetNodeProps[]
     * @required true
     * @default  -
     * @description 数据
     */
    @property({attribute: false})
    accessor data: CabinetNodeProps[] = [];

    /**
     * @kind "active" | "faded"
     * @required false
     * @default
     * @description 当前状态,是否高亮或者淡化
     */
    @property()
    accessor status: "active" | "faded";

    /**
     * @kind string|undefined
     * @required false
     * @default -
     * @description 容器标题
     */
    @property()
    accessor customTitle: string|undefined

    render(): React.ReactNode {
        return <CabinetContainerComponent
            type={this.type}
            data={this.data}
            status={this.status}
            customTitle={this.customTitle}
        />;
    }
}

export function CabinetContainerComponent(props: CabinetContainerProps): React.ReactElement {
    const {type, data, status, customTitle} = props;
    const [containerRef, {clientWidth, clientHeight}] = useResizeObserver<HTMLDivElement>();
    const binarySearch = (maxSizeCol: number, minSizeCol: number, maxSizeRow: number, minSizeRow: number): { col: number, row: number } => {
        // 利用二分法，去找到一个合适大小；
        // maxSizeCol < minSizeCol  maxSizeRow< minSizeRow
        const centerCol = Math.floor((maxSizeCol+minSizeCol)/2);
        const centerRow = Math.ceil((maxSizeRow+minSizeRow) /2);
        const needRow = Math.ceil(data.length /centerCol);
        const maxRow = Math.max(needRow,maxSizeRow),
            minRow = Math.min(needRow, minSizeRow);
        if(needRow === centerRow) {
            return {
                col: centerCol,
                row: needRow
            }
        }
        if(needRow > centerRow) {
            // 那么col要放大，
            return  binarySearch(centerCol ,minSizeCol,maxSizeRow, minRow)
        }
        if(needRow < centerRow) {
            // 那么col要缩小，
            return  binarySearch(maxSizeCol,minSizeCol,maxRow, minRow)
        }
    }
    const layoutWidth = useMemo(() => {
        if (!data.length) {
            return
        }

        //数据总量： A， 整个屏幕最大尺寸可以放 B, 整个屏幕最小尺寸可以放C,
        // B>=A,用 最大尺寸
        // C>=A: 用最小尺寸
        // B< A <C: 反推尺寸,
        const maxWidth = 92, minWidth = 56, maxHeight = 105, minHeight = 63;
        const realWidth = clientWidth - 26;
        const realHeight = clientHeight - 83;
        const maxSizeCol = Math.floor(realWidth / maxWidth),
            maxSizeRow = Math.floor(realHeight / maxHeight),
            minSizeCol = Math.floor(realWidth / minWidth),
            minSizeRow = Math.floor(realHeight / minHeight);
        const maxSizeNum = maxSizeCol * maxSizeRow,
            minSizeNum = minSizeCol * minSizeRow;
        const allNum = data.length;
        if (allNum <= maxSizeNum) {
            return {
                width: realWidth / maxSizeCol,
                itemWidth: maxWidth
            };
        } else if (allNum >= minSizeNum) {
            return {
                width: realWidth / minSizeCol,
                itemWidth: minWidth
            };
        } else {
            // 在区间内， 希望撑满整个屏幕, 尺寸肯定在最大和最小之间
            const {col} = binarySearch(maxSizeCol, minSizeCol, maxSizeRow, minSizeRow);
            return {
                width: realWidth / col,
                itemWidth: Math.max(realWidth / col - 10, minWidth),
            };
        }

    }, [data.length, clientHeight, clientWidth])

    return <div className="wrapper" ref={containerRef}>
        <div className={classNames("container", {
            hostContainer: type === "host",
            k8sContainer: type === "k8s",
        }, status && `container-${status}`)}
        >
            <div className="content">
                    {
                        data.map((item, index) => (
                            <div key={index} className="itemContent" style={{width:layoutWidth?.width}}>
                                <div className="item" style={{width:layoutWidth?.itemWidth}}>
                                    <WrappedNode type={item.type} nodeTitle={item.nodeTitle} status={item.status} />
                                </div>
                            </div>))
                    }
            </div>
            {customTitle && <div className="footer">{customTitle}</div>}
        </div>
    </div>

}

export {CabinetContainer}
