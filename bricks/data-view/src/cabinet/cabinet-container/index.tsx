import React, { useCallback, useMemo, useRef } from "react";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { createDecorators, EventEmitter } from "@next-core/element";
import variablesText from "../../data-view-variables.shadow.css";
import styleText from "./cabinet-container.shadow.css";
import classNames from "classnames";
import { CabinetNodeProps, CabinetNode } from "../cabinet-node/index.js";
import { useResizeObserver } from "../../hooks/index.js";

const { defineElement, property, event } = createDecorators();
export type ContainerType = "host" | "k8s" | "k8s-blue";
const WrappedNode = wrapBrick<CabinetNode, CabinetNodeProps>(
  "data-view.cabinet-node"
);
export interface ClickEventDataType {
  type: "node" | "container";
  data: CabinetNodeProps | undefined;
}

export interface CabinetContainerProps {
  data: CabinetNodeProps[];
  type?: ContainerType;
  customTitle?: string | undefined;
  status?: "active" | "faded";
  handleClick?: (params: ClickEventDataType) => void;
  handleDbClick?: (params: ClickEventDataType) => void;
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
class CabinetContainer
  extends ReactNextElement
  implements CabinetContainerProps
{
  /**
   * @kind ContainerType
   * @required true
   * @default  host
   * @description 容器类型，host、k8s（主题橙色）、k8s-blue（蓝色主题）
   */
  @property({ attribute: false })
  accessor type: ContainerType = "host";

  /**
   * @kind CabinetNodeProps[]
   * @required true
   * @default  -
   * @description 数据
   */
  @property({ attribute: false })
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
  accessor customTitle: string | undefined;

  /**
   * @detail
   * @description 节点或者container 点击事件
   */
  @event({ type: "container.click" })
  accessor #onHandleClick!: EventEmitter<ClickEventDataType>;

  /**
   * @detail
   * @description 节点或者container 双击击事件
   */
  @event({ type: "container.dbclick" })
  accessor #onHandleDbClick!: EventEmitter<ClickEventDataType>;

  handleClick = (params: ClickEventDataType) => {
    this.#onHandleClick.emit(params);
  };
  handleDbClick = (params: ClickEventDataType) => {
    this.#onHandleDbClick.emit(params);
  };

  render(): React.ReactNode {
    return (
      <CabinetContainerComponent
        type={this.type}
        data={this.data}
        status={this.status}
        customTitle={this.customTitle}
        handleClick={this.handleClick}
        handleDbClick={this.handleDbClick}
      />
    );
  }
}

export function CabinetContainerComponent(
  props: CabinetContainerProps
): React.ReactElement {
  const { type, data, status, customTitle, handleClick, handleDbClick } = props;
  const isDbClick = useRef<boolean>(false);
  const timerRef = useRef<number>();

  const [containerRef, { clientWidth, clientHeight }] =
    useResizeObserver<HTMLDivElement>();
  const binarySearch = useCallback(
    (
      maxSizeCol: number,
      minSizeCol: number,
      maxSizeRow: number,
      minSizeRow: number
    ): { col: number; row: number } => {
      // 利用二分法，去找到一个合适大小；
      const maxRow = Math.max(minSizeRow, maxSizeRow), // 2
        minRow = Math.min(minSizeRow, maxSizeRow), // 1
        minCol = Math.min(minSizeCol, maxSizeCol),
        maxCol = Math.max(minSizeCol, maxSizeCol);
      const centerCol = Math.ceil((maxSizeCol + minSizeCol) / 2); // 希望col多一些
      const centerRow = Math.ceil((maxSizeRow + minSizeRow) / 2);
      const needRow = Math.ceil(data.length / centerCol);
      if (centerCol <= 1) {
        return {
          col: 1,
          row: data.length,
        };
      }
      if (needRow === centerRow || minCol === maxCol) {
        return {
          col: centerCol,
          row: needRow,
        };
      }
      if (needRow > centerRow) {
        // 那么col要放大，row减少
        return binarySearch(centerCol, maxCol, needRow, minRow);
      }
      if (needRow < centerRow) {
        // 那么col要缩小，row增加
        return binarySearch(minCol, centerCol, maxRow, needRow);
      }
    },
    [data.length]
  );
  const layoutWidth = useMemo(() => {
    if (!data.length) {
      return;
    }

    //数据总量： A， 整个屏幕最大尺寸可以放 B, 整个屏幕最小尺寸可以放C,
    // B>=A,用 最大尺寸
    // C>=A: 用最小尺寸
    // B< A <C: 反推尺寸,
    const maxWidth = 118,
      minWidth = 56,
      maxHeight = 105,
      minHeight = 63;
    const realWidth = clientWidth - 27;
    const realHeight = clientHeight - 84;
    if (realWidth <= 0 || realHeight <= 0) {
      return;
    }
    const maxSizeCol = Math.floor(realWidth / maxWidth),
      maxSizeRow = Math.floor(realHeight / maxHeight),
      minSizeCol = Math.floor(realWidth / minWidth),
      minSizeRow = Math.floor(realHeight / minHeight);
    const maxSizeNum = maxSizeCol * maxSizeRow,
      minSizeNum = minSizeCol * minSizeRow;
    const allNum = data.length;
    if (allNum <= maxSizeNum) {
      return {
        width: Math.floor(realWidth / maxSizeCol),
        itemWidth: maxWidth,
      };
    } else if (allNum >= minSizeNum) {
      return {
        width: Math.floor(realWidth / minSizeCol),
        itemWidth: minWidth,
      };
    } else {
      // 在区间内， 希望撑满整个屏幕, 尺寸肯定在最大和最小之间
      const { col } = binarySearch(
        maxSizeCol,
        minSizeCol,
        maxSizeRow,
        minSizeRow
      );
      return {
        width: Math.floor(realWidth / col),
        itemWidth: Math.max(realWidth / col - 10, minWidth),
      };
    }
  }, [data.length, clientWidth, clientHeight, binarySearch]);

  const handleOnClick = (
    e: React.MouseEvent<HTMLDivElement>,
    data: CabinetNodeProps | undefined,
    type: "node" | "container"
  ) => {
    e.stopPropagation();
    window.clearTimeout(timerRef.current);
    isDbClick.current = false;
    timerRef.current = window.setTimeout(function () {
      if (!isDbClick.current) {
        handleClick?.({
          data,
          type,
        });
      }
    }, 200);
  };
  const handleOnDBClick = (
    e: React.MouseEvent<HTMLDivElement>,
    data: CabinetNodeProps | undefined,
    type: "node" | "container"
  ) => {
    window.clearTimeout(timerRef.current);
    isDbClick.current = true;
    e.stopPropagation();
    handleDbClick?.({
      data,
      type,
    });
  };

  return (
    <div
      className={classNames(
        "wrapper",
        {
          hostWrapper: type === "host" || type === "k8s-blue",
          k8sWrapper: type === "k8s",
        },
        status && `wrapper-${status}`
      )}
      ref={containerRef}
      onClick={(e) => handleOnClick(e, undefined, "container")}
      onDoubleClick={(e) => handleOnDBClick(e, undefined, "container")}
    >
      <div
        className={classNames(
          "container",
          {
            hostContainer: type === "host" || type === "k8s-blue",
            k8sContainer: type === "k8s",
          },
          status && `container-${status}`
        )}
      >
        <div className="content">
          <div className="contentLayout">
            {data.map((item, index) => (
              <div
                key={index}
                className="itemContent"
                style={{ width: layoutWidth?.width }}
              >
                <div
                  className="item"
                  style={{ width: layoutWidth?.itemWidth }}
                  onClick={(e) => handleOnClick(e, item, "node")}
                  onDoubleClick={(e) => handleOnDBClick(e, item, "node")}
                >
                  <WrappedNode
                    type={item.type}
                    nodeTitle={item.nodeTitle}
                    status={item.status}
                    isAlert={item.isAlert}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {customTitle && (
          <div className="footer">
            <div className="footerTitle">{customTitle}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export { CabinetContainer };
