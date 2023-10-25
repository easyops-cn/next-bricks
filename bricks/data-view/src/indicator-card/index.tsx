import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classnames from "classnames";
import blockUrl from "../asset/images/block.png";

const { defineElement, property } = createDecorators();

/**
 * 构件 `data-view.indicator-card`
 */
export
@defineElement("data-view.indicator-card", {
  styleTexts: [styleText],
})
class IndicatorCard extends ReactNextElement {
  /**
   * 展示类型，  `column`类型为上下三行、`row`类型为左右两行模式
   * @default `column`
   */
  @property({ attribute: false })
  accessor layout: Layout = "column";

  /**
   * 数据源
   * @default `[]`
   */
  @property({ attribute: false })
  accessor datasource: Datasource[] = [];

  render() {
    return (
      <IndicatorCardComponent
        datasource={this.datasource}
        layout={this.layout}
      />
    );
  }
}

export type Layout = "column" | "column-townhouse" | "row" | "row-townhouse";
export interface Datasource {
  value: any;
  desc: string;
  unit?: string;
}
export interface IndicatorCardComponentProps {
  datasource: Datasource[];
  layout?: Layout;
}
export function IndicatorCardComponent({
  datasource,
  layout,
}: IndicatorCardComponentProps) {
  const renderColumnView = useMemo(() => {
    return datasource.map((data, index) => (
      <div key={index} className={classnames("col-wrapper flex flex-col")}>
        <div className={"col-value"}>{data.value}</div>
        <div className={"col-desc"}>{data.desc}</div>
        <div className={"col-unit"}>{data.unit}</div>
      </div>
    ));
  }, [datasource]);

  const renderRowView = useMemo(() => {
    return datasource.map((data, index) => (
      <div key={index} className={"row-wrapper flex flex-row"}>
        <div className={"row-left"}>
          <img src={blockUrl} />
        </div>
        <div className={"row-right flex flex-col"}>
          <div className={"row-desc"}>{data.desc}</div>
          <div className={"row-value"}> {data.value}</div>
        </div>
      </div>
    ));
  }, [datasource]);

  return (
    <div
      className={classnames("container flex flex-row ", {
        townhouse: layout === "column-townhouse" || layout === "row-townhouse",
      })}
    >
      {layout.includes("row") ? renderRowView : renderColumnView}
    </div>
  );
}
