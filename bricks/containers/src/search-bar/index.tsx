import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

export type Align = "start" | "center" | "end";

export interface SearchBarProps {
  wrap?: boolean;
  align?: Align;
}

const { defineElement, property } = createDecorators();

/**
 * @id eo-search-bar
 * @name containers.search-bar
 * @docKind brick
 * @description 常用来包裹内容上方的搜索类构件
 * @author ice
 * @slots
 * start: 左侧搜索栏
 * end: 右侧操作栏
 * @history
 * @memo
 * @noInheritDoc
 */
export
@defineElement("eo-search-bar", {
  styleTexts: [styleText],
  alias: ["containers.search-bar"],
})
class SearchBar extends ReactNextElement {
  /**
   * @kind string
   * @required false
   * @default var(--card-content-gap)
   * @description bottom 偏移，`search-bar`常适配于`brick-table`，故默认加这个偏移，符合设计规范
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor marginBottom = "var(--card-content-gap)";

  /**
   * @kind boolean
   * @required false
   * @default false
   * @description 当在搜索框插槽`start`和`end`内元素居多时，元素溢出，设置为`true`时，内容区域可以换行
   * @group ui
   */
  @property({ type: Boolean })
  accessor wrap: boolean;

  /**
   * @kind  "start" |"center" | "end"
   * @required false
   * @default  "center"
   * @description  搜索栏中对齐的方式
   * @group ui
   */
  @property({ attribute: false })
  accessor align: Align = "center";

  render() {
    return <SearchBarComponent wrap={this.wrap} align={this.align} />;
  }
}

export function SearchBarComponent({ wrap, align }: SearchBarProps) {
  return (
    <div
      className="searchBarContainer"
      style={{
        flexWrap: wrap ? "wrap" : undefined,
        alignItems: align === "center" ? "center" : `flex-${align}`,
      }}
    >
      <div className="gridContainer startGrid">
        <slot id="startSlot" name="start"></slot>
      </div>
      <div className="gridContainer endGrid">
        <slot id="endSlot" name="end"></slot>
      </div>
    </div>
  );
}
