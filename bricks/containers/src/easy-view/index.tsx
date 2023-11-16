import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./easy-view.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 基于网格的简易布局容器
 * @author steve
 * @category container-layout
 */
@defineElement("eo-easy-view", {
  styleTexts: [styleText],
  alias: ["containers.easy-view"],
})
class EasyViewElement extends ReactNextElement {
  /**
   * 以键值对形式定义多个 [grid-area](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)
   */
  @property({ attribute: false })
  accessor gridAreas: Record<string, (string | number)[]>;

  /**
   * 定义 [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
   */
  @property({ attribute: false })
  accessor gridTemplateAreas: string[][];

  /**
   * 定义 [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)
   */
  @property({ attribute: false })
  accessor gridTemplateColumns: string | string[];

  /**
   * 定义 [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows)
   */
  @property({ attribute: false })
  accessor gridTemplateRows: string | string[];

  /**
   * 定义网格容器的样式
   */
  @property({ attribute: false })
  accessor containerStyle: React.CSSProperties;

  /**
   * 定义网格内各区域的样式
   */
  @property({ attribute: false })
  accessor styleByAreas: Record<string, React.CSSProperties>;

  render() {
    return (
      <EasyView
        gridAreas={this.gridAreas}
        gridTemplateAreas={this.gridTemplateAreas}
        gridTemplateColumns={this.gridTemplateColumns}
        gridTemplateRows={this.gridTemplateRows}
        containerStyle={this.containerStyle}
        styleByAreas={this.styleByAreas}
      />
    );
  }
}

interface EasyViewProps {
  gridAreas?: Record<string, (string | number)[]>;
  gridTemplateAreas?: string[][];
  gridTemplateColumns?: string | string[];
  gridTemplateRows?: string | string[];
  containerStyle?: React.CSSProperties;
  styleByAreas?: Record<string, React.CSSProperties>;
}

export function EasyView({
  gridAreas,
  gridTemplateAreas,
  gridTemplateColumns,
  gridTemplateRows,
  containerStyle,
  styleByAreas,
}: EasyViewProps): React.ReactElement {
  const areas = useMemo(
    () =>
      gridAreas
        ? Object.keys(gridAreas)
        : Array.from(new Set(gridTemplateAreas?.flat?.() ?? [])).filter(
            (area) => area !== "."
          ),
    [gridAreas, gridTemplateAreas]
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateAreas: gridTemplateAreas
          ?.map((row) => `"${row.join(" ")}"`)
          .join(" "),
        gridTemplateColumns: Array.isArray(gridTemplateColumns)
          ? gridTemplateColumns.join(" ")
          : gridTemplateColumns,
        gridTemplateRows: Array.isArray(gridTemplateRows)
          ? gridTemplateRows.join(" ")
          : gridTemplateRows,
        ...containerStyle,
      }}
    >
      {areas.map((area) => (
        <div
          key={area}
          style={{
            gridArea: gridAreas ? gridAreas[area].join(" / ") : area,
            ...styleByAreas?.[area],
          }}
        >
          <slot name={area} />
        </div>
      ))}
    </div>
  );
}

export { EasyViewElement };
