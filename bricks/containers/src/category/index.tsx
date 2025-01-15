import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./category.shadow.css";

const { defineElement, property } = createDecorators();

export interface CategoryProps {
  title: string;
  key: string;
}

export interface CategoryContainerProps {
  categories: CategoryProps[];
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  split?: boolean;
  headerMask?: boolean;
  showIndex?: boolean;
}

/**
 * 通用分类容器
 * @author sailorshe
 * @category container-display
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
  accessor categories: CategoryProps[];

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

  /**
   * 是否展示分割线
   */
  @property({
    type: Boolean,
  })
  accessor split: boolean;

  /**
   * 是否显示头部线条
   */
  @property({
    type: Boolean,
  })
  accessor headerMask: boolean;

  /**
   * 是否显示序号
   */
  @property({
    type: Boolean,
  })
  accessor showIndex: boolean;

  render() {
    return (
      <CategoryElement
        categories={this.categories}
        contentStyle={this.contentStyle}
        headerStyle={this.headerStyle}
        containerStyle={this.containerStyle}
        headerMask={this.headerMask}
        showIndex={this.showIndex}
      />
    );
  }
}

function CategoryElement(props: CategoryContainerProps): React.ReactElement {
  const {
    categories,
    headerStyle,
    showIndex,
    contentStyle,
    containerStyle,
    headerMask = true,
  } = props;
  return (
    <div className="category-container-wrapper" style={containerStyle}>
      {categories?.map(
        (categoryItem: CategoryProps, index: number): React.ReactElement => {
          return (
            <div className="category-item" key={categoryItem.key}>
              <div className="category-item-header" style={headerStyle}>
                <div className="category-left-wrap">
                  {headerMask && <span className="header-mark" />}
                  {showIndex && (
                    <span className="header-index">{index + 1}</span>
                  )}
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
        }
      )}
    </div>
  );
}

export { Category };
