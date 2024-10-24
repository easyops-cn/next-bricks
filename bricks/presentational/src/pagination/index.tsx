import React, { useEffect, useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import {
  DropdownActionsEvents,
  DropdownActionsEventsMapping,
  DropdownActionsProps,
  EoDropdownActions,
} from "@next-bricks/basic/dropdown-actions";
import { Trans } from "react-i18next";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import classNames from "classnames";
import { sortBy } from "lodash";
import "./host-context.css";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedDropdownActions = wrapBrick<
  EoDropdownActions,
  DropdownActionsProps,
  DropdownActionsEvents,
  DropdownActionsEventsMapping
>("eo-dropdown-actions", {
  onActionClick: "action.click",
  onVisibleChange: "visible.change",
});

interface EoPaginationProps {
  type?: "page" | "token";
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  nextToken?: string;
  previousToken?: string;
}

type ChangeDetail = ChangeDetailOfPage | ChangeDetailOfToken;

interface ChangeDetailOfPage {
  page: number;
  pageSize: number;
}

interface ChangeDetailOfToken {
  type: "token";
  nextToken: string | undefined;
  pageSize: number;
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
   * @default "page"
   */
  @property()
  accessor type: "page" | "token" | undefined;

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

  @property()
  accessor nextToken: string | undefined;

  @property()
  accessor previousToken: string | undefined;

  /**
   * 页码及每页条数改变事件
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<ChangeDetail>;
  #handleChange = (data: ChangeDetail) => {
    if ((data as ChangeDetailOfToken).type === "token") {
      this.nextToken = undefined;
      this.previousToken = undefined;
    } else {
      this.page = (data as ChangeDetailOfPage).page;
      this.pageSize = (data as ChangeDetailOfPage).pageSize;
    }
    this.#changeEvent.emit(data);
  };

  render() {
    return (
      <EoPaginationComponent
        type={this.type}
        total={this.total}
        page={this.page}
        pageSize={this.pageSize}
        pageSizeOptions={this.pageSizeOptions}
        onChange={this.#handleChange}
        showSizeChanger={this.showSizeChanger}
        nextToken={this.nextToken}
        previousToken={this.previousToken}
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
  onChange?: (data: ChangeDetail) => void;
}

export function EoPaginationComponent({
  type = "page",
  total,
  page,
  pageSize,
  pageSizeOptions,
  showSizeChanger = true,
  nextToken,
  previousToken,
  onChange,
}: EoPaginationComponentProps) {
  const { t } = useTranslation(NS);

  const [paginationData, setPaginationData] = useState<{
    page?: number;
    pageSize?: number;
    total?: number;
  }>({});

  useEffect(() => {
    const _total = formatValue(total, 0);
    const _page = formatValue(page, 0);
    const _pageSize = formatValue(pageSize, 0);
    setPaginationData({ total: _total, page: _page, pageSize: _pageSize });
  }, [page, pageSize, total]);

  const pageSizeActions = useMemo(() => {
    const options = [
      ...new Set([paginationData.pageSize].concat(pageSizeOptions || [])),
    ].map((v) => ({ text: t(K.PAGE_SIZE, { count: v }), key: v }));
    return sortBy(options, (value) => value.key);
  }, [paginationData.pageSize, pageSizeOptions, t]);

  const allPages = useMemo(
    () =>
      formatValue(Math.ceil(paginationData.total / paginationData.pageSize), 0),
    [paginationData.pageSize, paginationData.total]
  );

  const pagerDataSource = useMemo(() => {
    const data: PagerData[] = [];

    if (type === "token") {
      const prevArrow = {
        type: "prev-arrow",
        disabled: !previousToken,
      } as const;
      const nextArrow = {
        type: "next-arrow",
        disabled: !nextToken,
      } as const;
      data.push(prevArrow, nextArrow);
      return data;
    }

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
  }, [allPages, paginationData.page, type, nextToken, previousToken]);

  const handlePageSizeChange = (value: number) => {
    if (type === "token") {
      setPaginationData((pre) => ({ ...pre, pageSize: value }));
      onChange?.({ type, nextToken: undefined, pageSize: value });
    } else {
      setPaginationData((pre) => ({ ...pre, page: 1, pageSize: value }));
      onChange?.({ page: 1, pageSize: value });
    }
  };

  const handleArrowClick = (isNext: boolean, disabled?: boolean) => {
    if (disabled) {
      return;
    }
    if (type === "token") {
      onChange?.({
        type,
        nextToken: isNext ? nextToken : previousToken,
        pageSize: paginationData.pageSize,
      });
    } else {
      const newPage = paginationData.page + (isNext ? 1 : -1);
      setPaginationData((pre) => ({
        ...pre,
        page: newPage,
      }));
      onChange?.({
        page: newPage,
        pageSize: paginationData.pageSize,
      });
    }
  };

  const handlePagerClick = (pagerData: PagerData) => {
    switch (pagerData.type) {
      case "prev-arrow":
        handleArrowClick(false, pagerData.disabled);
        break;
      case "next-arrow":
        handleArrowClick(true, pagerData.disabled);
        break;
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
    <div className="wrapper">
      {type !== "token" && (
        <div className="total">
          <Trans
            i18nKey={t(K.TOTAL)}
            values={{ total: paginationData.total }}
            components={{
              total: <span className="total-number" />,
            }}
          />
        </div>
      )}
      {showSizeChanger && (
        <div className="size-changer">
          <WrappedDropdownActions
            actions={pageSizeActions}
            checkedKeys={[paginationData.pageSize]}
            onActionClick={(event) =>
              handlePageSizeChange(event.detail.key as number)
            }
          >
            <div className="size-selection">
              {t(K.PAGE_SIZE, { count: paginationData.pageSize })}
              <WrappedIcon lib="antd" theme="filled" icon="caret-down" />
            </div>
          </WrappedDropdownActions>
        </div>
      )}
      <div className="page">
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
      className={classNames("page-item", "number", active ? "active" : null)}
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
      className={classNames("page-item", "arrow", disabled ? "disabled" : null)}
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
      className={classNames("page-item", "jump")}
      title={title}
      onClick={onClick}
    >
      <WrappedIcon
        className="jump-arrow"
        lib="antd"
        theme="outlined"
        icon={icon}
      />
      <span className="jump-ellipsis">•••</span>
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
