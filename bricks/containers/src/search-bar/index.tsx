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
 * 常用来包裹内容上方的搜索类构件
 * @author ice
 * @slot start - 左侧搜索栏
 * @slot end - 右侧操作栏
 */
export
@defineElement("eo-search-bar", {
  styleTexts: [styleText],
  alias: ["containers.search-bar"],
})
class SearchBar extends ReactNextElement {
  /**
   * bottom 偏移，`search-bar`常适配于`brick-table`，故默认加这个偏移，符合设计规范
   */
  @property({
    attribute: false,
  })
  accessor marginBottom = "var(--card-content-gap)";

  /**
   * 当在搜索框插槽`start`和`end`内元素居多时，元素溢出，设置为`true`时，内容区域可以换行
   */
  @property({ type: Boolean })
  accessor wrap: boolean;

  /**
   * 搜索栏中对齐的方式
   */
  @property({ attribute: false })
  accessor align: Align = "center";

  connectedCallback(): void {
    // istanbul ignore else
    if (!this.style.display) {
      this.style.display = "block";
    }
    this.style.marginBottom = this.marginBottom;
    super.connectedCallback();
  }

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
