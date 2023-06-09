import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./category.shadow.css";

const { defineElement, property } = createDecorators();

export interface categoryProps {
  title: string;
  key: string;
}

export interface CategoryContainerProps {
  categories: categoryProps[];
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

/**
 * 通用分类容器
 * @author sailorshe
 *
 */
@defineElement("eo-category", {
  styleTexts: [styleText],
  alias: ["containers.general-category"],
})
class Category extends ReactNextElement implements CategoryContainerProps {
  /**
   * 分类信息
   */
  @property({
    attribute: false,
  })
  accessor categories: categoryProps[];

  /**
   * 内容样式
   */
  @property({
    attribute: false,
  })
  accessor contentStyle: React.CSSProperties;

  /**
   * 头部样式
   */
  @property({
    attribute: false,
  })
  accessor headerStyle: React.CSSProperties;

  /**
   * 容器样式
   */
  @property({
    attribute: false,
  })
  accessor containerStyle: React.CSSProperties;

  render() {
    return (
      <CategoryElement
        categories={this.categories}
        contentStyle={this.contentStyle}
        headerStyle={this.headerStyle}
        containerStyle={this.containerStyle}
      />
    );
  }
}

function CategoryElement(props: CategoryContainerProps): React.ReactElement {
  const { categories, headerStyle, contentStyle, containerStyle } = props;
  return (
    <div className="category-container-wrapper" style={containerStyle}>
      {categories?.map((categoryItem: categoryProps): React.ReactElement => {
        return (
          <div className="category-item" key={categoryItem.key}>
            <div className="category-item-header" style={headerStyle}>
              <div className="category-left-wrap">
                <span className="header-mark"></span>
                <span className="header-title">
                  {categoryItem.title}
                  <slot
                    id={`${categoryItem.key}-titleSlot`}
                    name={`${categoryItem.key}.titleSuffix`}
                  />
                </span>
              </div>
              <div className="header-right-wrap">
                <slot name="headerToolbar" />
              </div>
            </div>
            <div className="category-item-content" style={contentStyle}>
              <slot name={categoryItem.key} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Category };
