import React, { useMemo } from "react";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { createDecorators } from "@next-core/element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./graph-layout-grid.shadow.css";
import { GraphNode, GraphNodeProps } from "../node/index.js";
import { GraphText, GraphTextProps } from "../text/index.js";

const { defineElement, property } = createDecorators();

const WrappedGraphNode = wrapBrick<GraphNode, GraphNodeProps>(
  "data-view.graph-node"
);
const WrappedGraphText = wrapBrick<GraphText, GraphTextProps>(
  "data-view.graph-text"
);

export type DataSourceType = GraphTextProps & GraphNodeProps;
export interface GraphLayoutGridProps {
  columns: number;
  rows: number;

  dataSource?: DataSourceType[];
  isReverse?: boolean;
}

/**
 * Graph grid 布局
 * @author astrid
 * @category big-screen-content
 */
@defineElement("data-view.graph-layout-grid", {
  styleTexts: [variablesStyleText, styleText],
})
class GraphLayoutGrid extends ReactNextElement implements GraphLayoutGridProps {
  /**
   * @kind number
   * @default -
   * @required true
   * @description 布局的列数
   */
  @property({ type: Number })
  accessor columns: number;

  /**
   * @kind number
   * @default -
   * @required true
   * @description 布局的行数
   */
  @property({ type: Number })
  accessor rows: number;

  /**
   * @kind boolean
   * @default -
   * @required false
   * @description 布局是否反转， 默认排布方式是: 奇数行位置13579...，偶数行是02468...,isReverse为true后，偶数行位置13579...，奇数行是02468...
   */
  @property({ type: Boolean })
  accessor isReverse: boolean;

  /**
   * @kind DataSourceType[]
   * @default -
   * @required  false
   * @description 数据源
   */
  @property({ attribute: false })
  accessor dataSource: DataSourceType[];

  render(): React.ReactNode {
    return (
      <GraphLayoutGridComponent
        rows={this.rows}
        columns={this.columns}
        isReverse={this.isReverse}
        dataSource={this.dataSource}
      />
    );
  }
}

export function GraphLayoutGridComponent(
  props: GraphLayoutGridProps
): React.ReactElement {
  const { rows, columns, isReverse, dataSource } = props;
  const layoutItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= columns; j++) {
        if (
          (isReverse &&
            ((i % 2 === 1 && j % 2 === 1) || (i % 2 === 0 && j % 2 === 0))) ||
          (!isReverse &&
            ((i % 2 === 1 && j % 2 === 0) || (i % 2 === 0 && j % 2 === 1)))
        ) {
          // isReverse : true 偶数行位置13579...，奇数行是02468..
          // isReverse : false 奇数行位置13579...，偶数行是02468...
          const curData: DataSourceType = dataSource?.[items.length];
          items.push(
            <div
              key={`${i}-${j}`}
              className="item"
              style={{
                gridArea: `${i} / ${j % columns || columns} /${i} / ${
                  j % columns || columns
                }`,
              }}
            >
              {curData && (
                <React.Fragment>
                  <WrappedGraphText
                    text={curData.text}
                    value={curData.value}
                    className="text"
                  />
                  <WrappedGraphNode url={curData.url} className="node" />
                </React.Fragment>
              )}
            </div>
          );
        }
      }
    }
    return items;
  }, [rows, columns, isReverse, dataSource]);

  return (
    <div
      className="container"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {layoutItems}
    </div>
  );
}

export { GraphLayoutGrid };
