import React, { useEffect, useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Popover, PopoverProps } from "@next-bricks/basic/popover";
import type { Menu } from "@next-bricks/basic/menu";
import type { MenuItem } from "@next-bricks/basic/menu-item";
import { Trans } from "react-i18next";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import classNames from "classnames";
import { sortBy } from "lodash";
import "./host-context.css";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedPopover = wrapBrick<Popover, PopoverProps>("eo-popover");
const WrappedMenu = wrapBrick<Menu, any>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, any>("eo-menu-item");

interface EoPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
}

/**
 * 分页
 * @author nlicro
 * @category navigation
 */
export
@defineElement("eo-pagination", {
  styleTexts: [styleText],
})
class EoPagination extends ReactNextElement {
  /**
   * 数据总数
   */
  @property({
    type: Number,
  })
  accessor total: number = 0;

  /**
   * 当前页数
   */
  @property({
    type: Number,
  })
  accessor page: number = 1;

  /**
   * 每页条数
   */
  @property({
    type: Number,
  })
  accessor pageSize: number = 20;

  /**
   * 指定每页可以显示多少条
   */
  @property({
    attribute: false,
  })
  accessor pageSizeOptions: number[] = [10, 20, 50, 100];

  /**
   * 是否展示`pageSize`分页器
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor showSizeChanger: boolean | undefined;

  /**
   * 页码及每页条数改变事件
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<{ page: number; pageSize: number }>;
  #handleChange = (data: { page: number; pageSize: number }) => {
    this.page = data.page;
    this.pageSize = data.pageSize;
    this.#changeEvent.emit(data);
  };

  render() {
    return (
      <EoPaginationComponent
        total={this.total}
        page={this.page}
        pageSize={this.pageSize}
        pageSizeOptions={this.pageSizeOptions}
        onChange={this.#handleChange}
        showSizeChanger={this.showSizeChanger}
      />
    );
  }
}

interface PageArrowData {
  type: "prev-arrow" | "next-arrow";
  disabled?: boolean;
}

interface PageJumpData {
  type: "prev-jump" | "next-jump";
  span: number;
}

interface PageItemData {
  type: "page";
  page: number;
  active?: boolean;
}

type PagerData = PageArrowData | PageJumpData | PageItemData;

interface EoPaginationComponentProps extends EoPaginationProps {
  onChange?: (data: { page: number; pageSize: number }) => void;
}

export function EoPaginationComponent(props: EoPaginationComponentProps) {
  const { t } = useTranslation(NS);
  const { onChange, showSizeChanger = true } = props;

  const [paginationData, setPaginationData] = useState<{
    page?: number;
    pageSize?: number;
    total?: number;
  }>({});

  useEffect(() => {
    const _total = formatValue(props.total, 0);
    const _page = formatValue(props.page, 0);
    const _pageSize = formatValue(props.pageSize, 0);
    setPaginationData({ total: _total, page: _page, pageSize: _pageSize });
  }, [props.page, props.pageSize, props.total]);

  const pageSizeOptions = useMemo(() => {
    const options = [paginationData.pageSize]
      .concat(props.pageSizeOptions || [])
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
    return sortBy([...new Set(options)], (value) => value);
  }, [paginationData.pageSize, props.pageSizeOptions]);

  const allPages = useMemo(
    () =>
      formatValue(Math.ceil(paginationData.total / paginationData.pageSize), 0),
    [paginationData.pageSize, paginationData.total]
  );

  const pagerDataSource = useMemo(() => {
    const data: PagerData[] = [];

    const prevArrow = {
      type: "prev-arrow",
      disabled: paginationData.page === 1 || allPages === 0,
    } as const;
    const nextArrow = {
      type: "next-arrow",
      disabled: paginationData.page === allPages || allPages === 0,
    } as const;
    const prevJump = { type: "prev-jump", span: 5 } as const;
    const nextJump = { type: "next-jump", span: 5 } as const;

    const pageList = getPageWindow(allPages, paginationData.page, 5).map(
      (p) => {
        return {
          type: "page",
          page: p,
          active: p === paginationData.page,
        } as const;
      }
    );

    data.push(prevArrow);

    if (pageList.length && pageList[0].page > 1) {
      data.push({ type: "page", page: 1 });
      if (pageList[0].page > 2) {
        data.push(prevJump);
      }
    }

    pageList.forEach((p) => data.push(p));

    if (pageList.length && pageList[pageList.length - 1].page < allPages) {
      if (pageList[pageList.length - 1].page < allPages - 1) {
        data.push(nextJump);
      }
      data.push({ type: "page", page: allPages });
    }

    data.push(nextArrow);

    return data;
  }, [allPages, paginationData.page]);

  const handlePageSizeChange = (value: number) => {
    setPaginationData((pre) => ({ ...pre, page: 1, pageSize: value }));
    onChange?.({ page: 1, pageSize: value });
  };

  const handlePagerClick = (pagerData: PagerData) => {
    switch (pagerData.type) {
      case "prev-arrow": {
        if (!pagerData.disabled) {
          setPaginationData((pre) => ({
            ...pre,
            page: paginationData.page - 1,
          }));
          onChange?.({
            page: paginationData.page - 1,
            pageSize: paginationData.pageSize,
          });
        }
        break;
      }
      case "next-arrow": {
        if (!pagerData.disabled) {
          setPaginationData((pre) => ({
            ...pre,
            page: paginationData.page + 1,
          }));
          onChange?.({
            page: paginationData.page + 1,
            pageSize: paginationData.pageSize,
          });
        }
        break;
      }
      case "prev-jump": {
        const _page =
          paginationData.page - pagerData.span < 1
            ? 1
            : paginationData.page - pagerData.span;
        setPaginationData((pre) => ({ ...pre, page: _page }));
        onChange?.({ page: _page, pageSize: paginationData.pageSize });
        break;
      }
      case "next-jump": {
        const _page =
          paginationData.page + pagerData.span > allPages
            ? allPages
            : paginationData.page + pagerData.span;
        setPaginationData((pre) => ({ ...pre, page: _page }));
        onChange?.({ page: _page, pageSize: paginationData.pageSize });
        break;
      }
      case "page": {
        setPaginationData((pre) => ({ ...pre, page: pagerData.page }));
        onChange?.({ page: pagerData.page, pageSize: paginationData.pageSize });
      }
    }
  };

  return (
    <div className="pagination-wrapper">
      <div className="pagination-total">
        <Trans
          i18nKey={t(K.TOTAL)}
          values={{ total: paginationData.total }}
          components={{
            total: <span className="pagination-total-number" />,
          }}
        />
      </div>
      {showSizeChanger && (
        <div className="pagination-size-changer">
          <WrappedPopover placement="bottom" arrow={false} distance={4}>
            <div className="pagination-size-selection" slot="anchor">
              {t(K.PAGE_SIZE, { count: paginationData.pageSize })}
              <WrappedIcon lib="antd" theme="filled" icon="caret-down" />
            </div>
            <WrappedMenu className="pagination-size-selector-menu">
              {pageSizeOptions.map((value) => {
                const active = value === paginationData.pageSize;
                return (
                  <WrappedMenuItem
                    className={classNames(
                      "pagination-size-selector-item",
                      active ? "pagination-size-selector-active" : null
                    )}
                    key={value}
                    onClick={() => handlePageSizeChange(value)}
                  >
                    {t(K.PAGE_SIZE, { count: value })}
                  </WrappedMenuItem>
                );
              })}
            </WrappedMenu>
          </WrappedPopover>
        </div>
      )}
      <div className="pagination-page">
        {pagerDataSource.map((pagerData) => {
          switch (pagerData.type) {
            case "prev-arrow":
            case "next-arrow": {
              return (
                <PageArrow
                  key={pagerData.type}
                  {...pagerData}
                  onClick={() => handlePagerClick(pagerData)}
                />
              );
            }
            case "prev-jump":
            case "next-jump": {
              return (
                <PageJump
                  key={pagerData.type}
                  {...pagerData}
                  onClick={() => handlePagerClick(pagerData)}
                />
              );
            }
            case "page": {
              return (
                <PageItem
                  key={pagerData.page}
                  {...pagerData}
                  onClick={() => handlePagerClick(pagerData)}
                />
              );
            }
          }
        })}
      </div>
    </div>
  );
}

function PageItem(props: PageItemData & { onClick?: () => void }) {
  const { active, page, onClick } = props;
  return (
    <div
      className={classNames(
        "pagination-page-item",
        "pagination-page-item-number",
        active ? "pagination-page-item-active" : null
      )}
      title={String(page)}
      onClick={onClick}
    >
      {page}
    </div>
  );
}

function PageArrow(props: PageArrowData & { onClick?: () => void }) {
  const { t } = useTranslation(NS);
  const { type, disabled, onClick } = props;
  const icon = type === "prev-arrow" ? "left" : "right";
  const title =
    type === "prev-arrow" ? t(K.PREVIOUS_PAGE_one) : t(K.NEXT_PAGE_one);

  return (
    <div
      className={classNames(
        "pagination-page-item",
        "pagination-page-item-arrow",
        disabled ? "pagination-page-item-disabled" : null
      )}
      title={title}
      onClick={onClick}
    >
      <WrappedIcon lib="antd" theme="outlined" icon={icon} />
    </div>
  );
}

function PageJump(props: PageJumpData & { onClick?: () => void }) {
  const { t } = useTranslation(NS);
  const { type, span, onClick } = props;
  const icon = type === "prev-jump" ? "double-left" : "double-right";
  const title =
    type === "prev-jump"
      ? t(K.PREVIOUS_PAGE_other, { count: span })
      : t(K.NEXT_PAGE_other, { count: span });

  return (
    <div
      className={classNames(
        "pagination-page-item",
        "pagination-page-item-jump"
      )}
      title={title}
      onClick={onClick}
    >
      <WrappedIcon
        className="pagination-page-item-jump-arrow"
        lib="antd"
        theme="outlined"
        icon={icon}
      />
      <span className="pagination-page-item-jump-ellipsis">•••</span>
    </div>
  );
}

function formatValue(value: number, defaultValue: number): number {
  const _value = Number(value);

  return Number.isNaN(_value) ? defaultValue : _value;
}

function getPageWindow(allPages: number, page: number, size: number) {
  let leftPage, rightPage;
  if (allPages <= size) {
    leftPage = 1;
    rightPage = allPages;
  } else {
    let leftSize = Math.floor((size - 1) / 2);
    let rightSize = size - 1 - leftSize;

    if (page - leftSize < 1) {
      rightSize += leftSize - page + 1;
    }
    if (page + rightSize > allPages) {
      leftSize += page + rightSize - allPages;
    }
    leftPage = page - leftSize < 1 ? 1 : page - leftSize;
    rightPage = page + rightSize > allPages ? allPages : page + rightSize;
  }
  return Array.from(new Array(rightPage + 1).keys()).slice(leftPage);
}
