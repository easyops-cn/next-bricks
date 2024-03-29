import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type { ComponentSize as MediaSize } from "../interface.js";
import styleText from "./grid-layout.shadow.css";

const { defineElement, property } = createDecorators();

export interface ResponsiveSettings {
  large?: GridSettings;
  medium?: GridSettings;
  small?: GridSettings;
  xs?: GridSettings;
}
export interface GridSettings {
  columns?: number;
  rows?: number;
  templateColumns?: string;
  columnSpan?: number;
  rowSpan?: number;
}

export interface GridProps {
  columns?: number;
  rows?: number;
  rowSpan?: number;
  columnSpan?: number;
  templateColumns?: string;
  alignItems?: CSSProperties["alignItems"];
  alignContent?: CSSProperties["alignContent"];
  justifyItems?: CSSProperties["justifyItems"];
  justifyContent?: CSSProperties["justifyContent"];
  autoFlow?: CSSProperties["gridAutoFlow"];
  responsive?: ResponsiveSettings;
  gap?: string;
  showGridBorder?: boolean;
  gridBorderColor?: string;
}

const mediaSizeList: MediaSize[] = ["large", "medium", "small", "xs"];

const mediaQueryMap: Record<MediaSize, string> = {
  large: "(max-width: 1920px)",
  medium: "(max-width: 1600px)",
  small: "(max-width: 1280px)",
  xs: "(max-width: 1024px)",
};

/**
 * 多行多列的响应式网格布局
 * @author abert
 * @category container-layout
 */
@defineElement("eo-grid-layout", {
  styleTexts: [styleText],
  alias: ["containers.grid-layout"],
})
class GridLayout extends ReactNextElement implements GridProps {
  #sizeMatch: Partial<Record<MediaSize, boolean>> = {};
  // eslint-disable-next-line @typescript-eslint/ban-types
  #mediaMatchListeners: Function[] = [];
  /**
   * 网格布局列数（各列等宽）
   */
  @property({
    type: Number,
  })
  accessor columns: number | undefined;
  /**
   * 网格布局行数
   * @default 1
   */
  @property({
    type: Number,
  })
  accessor rows = 1;

  /**
   * 在父级网格中所占行数
   * @default 1
   */
  @property({
    type: Number,
  })
  accessor rowSpan = 1;

  /**
   * 在父级网格中所占列数
   * @default 1
   */
  @property({
    type: Number,
  })
  accessor columnSpan = 1;

  /**
   * 网格布局模板列
   */
  @property({
    type: String,
  })
  accessor templateColumns: string | undefined;

  /**
   * 设置单元格的垂直位置
   */
  @property({
    type: String,
  })
  accessor alignItems: CSSProperties["alignItems"] | undefined;
  /**
   * 设置整个内容区域的垂直位置
   */
  @property({
    type: String,
  })
  accessor alignContent: CSSProperties["alignContent"] | undefined;
  /**
   * 设置单元格内容的水平位置
   */
  @property({
    type: String,
  })
  accessor justifyItems: CSSProperties["justifyItems"] | undefined;
  /**
   * 设置整个内容区域在容器里面的水平位置
   */
  @property({
    type: String,
  })
  accessor justifyContent: CSSProperties["justifyContent"] | undefined;

  /**
   * 子元素自动排布顺序
   */
  @property({
    type: String,
  })
  accessor autoFlow: CSSProperties["gridAutoFlow"] | undefined;

  /**
   * 响应式布局设置
   * @defaukt 1
   */
  @property({
    attribute: false,
  })
  accessor responsive: ResponsiveSettings | undefined;

  /**
   * 子元素之间的间距
   * @default "var(--page-card-gap)"
   */
  @property({
    type: String,
  })
  accessor gap = "var(--page-card-gap)";

  /**
   * 是否展示网格布局边框
   */
  @property({
    type: Boolean,
  })
  accessor showGridBorder = false;

  /**
   * 网格布局边框颜色
   */
  @property({
    type: String,
  })
  accessor gridBorderColor: string | undefined;

  connectedCallback(): void {
    this._clearMediaMatchListeners();
    if (window.matchMedia && this.responsive) {
      for (const [media, query] of Object.entries(mediaQueryMap)) {
        if (this.responsive[media as MediaSize]) {
          const mediaMatch = window.matchMedia(query);
          this.#sizeMatch[media as MediaSize] = mediaMatch.matches;
          const handler = (e: MediaQueryListEvent): void => {
            this.#sizeMatch[media as MediaSize] = e.matches;
            this.render();
          };
          if (mediaMatch.addEventListener) {
            mediaMatch.addEventListener("change", handler);
            this.#mediaMatchListeners.push(() => {
              mediaMatch.removeEventListener("change", handler);
            });
          } else {
            mediaMatch.addListener(handler);
            this.#mediaMatchListeners.push(() => {
              mediaMatch.removeListener(handler);
            });
          }
        }
      }
    }
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearMediaMatchListeners();
    this.#sizeMatch = {};
  }

  _clearMediaMatchListeners(): void {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let fn: Function | undefined;
    while ((fn = this.#mediaMatchListeners.pop())) {
      fn();
    }
  }

  handleShowGridBorder(): void {
    if (this.showGridBorder) {
      this.style.setProperty(
        "--grid-border-color",
        this.gridBorderColor ?? "#454547"
      );
    } else {
      if (this.style.getPropertyValue("--grid-border-color")) {
        this.style.removeProperty("--grid-border-color");
      }
    }
  }

  #initLayout() {
    const layout = {
      columns: this.columns,
      rows: this.rows,
      columnSpan: this.columnSpan,
      rowSpan: this.rowSpan,
    };

    for (const size of mediaSizeList) {
      if (this.#sizeMatch[size]) {
        Object.assign(layout, this.responsive?.[size]);
      }
    }

    return {
      columns: layout.columns || 1,
      rows: layout.rows || 1,
      columnSpan: layout.columnSpan || 1,
      rowSpan: layout.rowSpan || 1,
    };
  }

  render() {
    const { columnSpan, rowSpan, columns, rows } = this.#initLayout();

    const gridProps: CSSProperties = {
      justifyContent: this.justifyContent,
      justifyItems: this.justifyItems,
      alignContent: this.alignContent,
      alignItems: this.alignItems,
      gridAutoFlow: this.autoFlow,
      gridGap: this.gap,
      gap: this.gap,
      gridColumn: columnSpan === 1 ? "" : `span ${columnSpan}`,
      gridRow: rowSpan === 1 ? "" : `span ${rowSpan}`,
      gridTemplateColumns:
        this.templateColumns || (columns === 1 ? "" : `repeat(${columns},1fr)`),
      gridTemplateRows: rows === 1 ? "" : `repeat(${rows},1fr)`,
    };

    Object.entries(gridProps).forEach(([key, value]) => {
      if (value != null) {
        this.style[key as any] = value;
      }
    });

    this.handleShowGridBorder();

    return <slot />;
  }
}

export { GridLayout };
