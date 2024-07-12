import React, { useEffect, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { Card, CardProps } from "@next-bricks/containers/card";
import type {
  GridLayout,
  GridProps,
} from "@next-bricks/containers/grid-layout";
import styleText from "./descriptions.shadow.css";
import "@next-core/theme";
import type { UseBrickConf } from "@next-core/types";
import classnames from "classnames";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import "./host-context.css";

const WrappedGeneralCard = wrapBrick<Card, CardProps>("eo-card");

const WrappedGridLayout = wrapBrick<GridLayout, GridProps>("eo-grid-layout");

interface DescriptionItem {
  label: string;
  field?: string;
  group?: string;
  text?: string | number;
  useBrick?: UseBrickConf;
}

type Layout = "horizontal" | "vertical";

export interface DescriptionsProps {
  descriptionTitle?: string;
  list?: DescriptionItem[];
  showCard?: boolean;
  column?: number;
  layout?: Layout;
  bordered?: boolean;
  hideGroups?: string[] | string;
  dataSource?: Record<string, unknown>;
}

const { defineElement, property } = createDecorators();

/**
 * 通用描述列表构件
 * @author sailor
 * @category text
 */
@defineElement("eo-descriptions", {
  styleTexts: [styleText],
  alias: ["presentational.general-descriptions"],
})
class Descriptions extends ReactNextElement {
  /**
   * 描述标题
   */
  @property()
  accessor descriptionTitle: string | undefined;

  /**
   * 描述列表
   */
  @property({
    attribute: false,
  })
  accessor list: DescriptionItem[] | undefined;

  /**
   * 是否展示卡片背景
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showCard: boolean | undefined;

  /**
   * 列数
   */
  @property({
    attribute: true,
  })
  accessor column: number | undefined;

  /**
   * 布局模式
   * @default "horizontal"
   */
  @property()
  accessor layout: Layout | undefined;

  /**
   * 是否展示边框
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor bordered: boolean | undefined;

  /**
   * 隐藏的描述列表项
   */
  @property({
    attribute: false,
  })
  accessor hideGroups: string | string[] | undefined;

  /**
   * 数据源
   */
  @property({
    attribute: false,
  })
  accessor dataSource: Record<string, unknown> | undefined;

  render() {
    return (
      <DescriptionsComponent
        descriptionTitle={this.descriptionTitle}
        list={this.list}
        showCard={this.showCard}
        column={this.column}
        layout={this.layout}
        bordered={this.bordered}
        hideGroups={this.hideGroups}
        dataSource={this.dataSource}
      />
    );
  }
}

export function DescriptionsComponent(props: DescriptionsProps) {
  const {
    descriptionTitle,
    list,
    showCard = true,
    column = 3,
    layout = "horizontal",
    bordered = false,
    hideGroups,
    dataSource: _dataSource,
  } = props;
  const dataSource = useMemo(() => _dataSource ?? {}, [_dataSource]);
  const [hideGroupsSet, setHideGroupsSet] = useState<Set<string>>();

  const renderItem = (item: DescriptionItem) => {
    if (item.useBrick) {
      return (
        <ReactUseMultipleBricks useBrick={item.useBrick} data={dataSource} />
      );
    }
    return item.field != null ? String(dataSource[item.field]) : item.text;
  };

  useEffect(() => {
    if (hideGroups) {
      const newHideGroupsSet = new Set(
        ([] as string[]).concat(hideGroups).filter(Boolean)
      );
      setHideGroupsSet(newHideGroupsSet);
    }
  }, [hideGroups]);

  return (
    <WrappedGeneralCard
      cardTitle={descriptionTitle}
      headerStyle={{
        border: "none",
        padding: "var(--description-header-padding)",
        color: "var(--color-header-text)",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: 500,
      }}
      background={showCard}
    >
      <WrappedGridLayout
        gap={layout === "vertical" || bordered ? "0" : "10px"}
        columns={column}
        className={classnames("description-content", { bordered })}
      >
        {list
          ?.filter((item) =>
            item.group ? !hideGroupsSet?.has(item.group) : true
          )
          ?.map((item, index) => (
            <div
              key={index}
              className={classnames("description-item", layout, {
                bordered,
              })}
              style={{
                ...(index === list.length - 1
                  ? {
                      gridColumnStart: list.length % column,
                      gridColumnEnd: +column + 1,
                    }
                  : {}),
              }}
            >
              <span className="description-item-label">
                {item.label}
                {bordered ? "" : ": "}
              </span>
              <span className="description-item-content">
                {renderItem(item)}
              </span>
            </div>
          ))}
      </WrappedGridLayout>
    </WrappedGeneralCard>
  );
}

export { Descriptions };
