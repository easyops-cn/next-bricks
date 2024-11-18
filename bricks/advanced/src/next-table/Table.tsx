import React, {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Column,
  RecordType,
  DataSource,
  PaginationType,
  RowSelectionType,
  ExpandableType,
  Sort,
  CellConfig,
} from "./interface.js";
import { Table, ConfigProvider, theme } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { useCurrentTheme } from "@next-core/react-runtime";
import { RowSelectMethod, type SortOrder } from "antd/es/table/interface.js";
import type { TableProps } from "antd/es/table";
import { i18n } from "@next-core/i18n";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { Trans } from "react-i18next";
import { K, NS, locales } from "./i18n.js";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  defaultPaginationConfig,
  defaultRowSelectionConfig,
  getAllKeys,
  getValueByDataIndex,
  isPlainObject,
  naturalComparator,
  searchList,
} from "./utils.js";
import { isNil, keyBy } from "lodash";
import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { checkIfByTransform } from "@next-core/runtime";
import {
  type DragEndEvent,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { DraggableRow, Row } from "./Row.js";
import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US.js";
import zhCN from "antd/locale/zh_CN.js";
import { CacheUseBrickItem } from "./CacheUseBrickItem.js";

initializeReactI18n(NS, locales);

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export interface NextTableComponentProps {
  shadowRoot: ShadowRoot | null;
  rowKey: string;
  columns?: Column[];
  cell?: CellConfig;
  dataSource?: DataSource;
  frontSearch?: boolean;
  pagination?: PaginationType;
  loading?: boolean;
  multiSort?: boolean;
  sort?: Sort | Sort[];
  rowSelection?: RowSelectionType;
  selectedRowKeys?: (string | number)[];
  hiddenColumns?: (string | number)[];
  expandable?: ExpandableType;
  expandedRowKeys?: (string | number)[];
  childrenColumnName: string;
  rowDraggable?: boolean;
  searchFields?: (string | string[])[];
  size?: TableProps<RecordType>["size"];
  showHeader?: boolean;
  bordered?: boolean;
  scrollConfig?: TableProps<RecordType>["scroll"];
  optimizedColumns?: (string | number)[];
  onPageChange?: (detail: { page: number; pageSize: number }) => void;
  onPageSizeChange?: (detail: { page: number; pageSize: number }) => void;
  onSort?: (detail?: Sort | Sort[]) => void;
  onRowSelect?: (detail: {
    keys: (string | number)[];
    rows: RecordType[];
    info: { type: RowSelectMethod };
  }) => void;
  onRowExpand?: (detail: { expanded: boolean; record: RecordType }) => void;
  onExpandedRowsChange?: (detail: (string | number)[]) => void;
  onRowDrag?: (detail: {
    list: RecordType[];
    active: RecordType;
    over: RecordType;
  }) => void;
}

export interface NextTableComponentRef {
  search: (params: { q: string }) => void;
}

export const NextTableComponent = forwardRef(function LegacyNextTableComponent(
  props: NextTableComponentProps,
  ref: Ref<NextTableComponentRef>
) {
  const {
    shadowRoot,
    rowKey,
    columns,
    cell,
    dataSource,
    frontSearch,
    pagination,
    loading,
    multiSort,
    rowSelection,
    hiddenColumns,
    expandable,
    childrenColumnName,
    rowDraggable,
    searchFields,
    size,
    showHeader,
    bordered,
    scrollConfig,
    optimizedColumns,
    onPageChange,
    onPageSizeChange,
    onSort,
    onRowSelect,
    onRowExpand,
    onExpandedRowsChange,
    onRowDrag,
  } = props;

  const { t } = useTranslation(NS);
  const styleCache = useMemo(() => {
    return createCache();
  }, []);
  const currentTheme = useCurrentTheme();
  const locale = (i18n.language.split("-")[0] === "zh"
    ? zhCN
    : enUS) as unknown as Locale;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const [list, setList] = useState<RecordType[] | undefined>(dataSource?.list);
  const keyList = useMemo(
    () => dataSource?.list?.map((v) => v[rowKey]) ?? [],
    [dataSource?.list, rowKey]
  );

  const [{ page, pageSize }, setPageAndPageSize] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: dataSource?.page ?? DEFAULT_PAGE,
    pageSize: dataSource?.pageSize ?? DEFAULT_PAGE_SIZE,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<
    (string | number)[] | undefined
  >(props.selectedRowKeys);
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(
    props.expandedRowKeys ?? []
  );
  const [sort, setSort] = useState<Sort | Sort[] | undefined>(props.sort);

  const isTreeData = useMemo(
    () => dataSource?.list?.some((v) => v[childrenColumnName]?.length),
    [dataSource?.list, childrenColumnName]
  );

  useEffect(() => {
    setSelectedRowKeys(props.selectedRowKeys);
  }, [props.selectedRowKeys]);

  useEffect(() => {
    setExpandedRowKeys(props.expandedRowKeys ?? []);
  }, [props.expandedRowKeys]);

  useEffect(() => {
    if (isPlainObject(expandable) && expandable.defaultExpandAllRows) {
      setExpandedRowKeys(
        getAllKeys({
          list: dataSource?.list,
          rowKey,
          childrenColumnName,
        })
      );
    }
  }, []);

  useEffect(() => {
    setList(dataSource?.list);
    setPageAndPageSize({
      page: dataSource?.page ?? DEFAULT_PAGE,
      pageSize: dataSource?.pageSize ?? DEFAULT_PAGE_SIZE,
    });
  }, [dataSource]);

  useEffect(() => {
    setSort(props.sort);
  }, [props.sort]);

  const processedColumns = useMemo(() => {
    const hiddenColumnsSet = new Set(hiddenColumns);
    const optimizedColumnsSet = new Set(optimizedColumns);
    const sortMap = keyBy(([] as Sort[]).concat(sort || []), "columnKey");

    return columns
      ?.filter((col) => !hiddenColumnsSet.has(col.key!))
      .map((col) => {
        const curSort = sortMap[col.key!];
        const comparator = (
          recordA: RecordType,
          recordB: RecordType,
          sortOrder?: SortOrder
        ) => {
          return naturalComparator(
            getValueByDataIndex(recordA, col.dataIndex),
            getValueByDataIndex(recordB, col.dataIndex),
            sortOrder
          );
        };

        return {
          ...col,
          ...(col.sortable
            ? {
                sorter: multiSort
                  ? {
                      compare: frontSearch ? comparator : undefined,
                      multiple: col.sortPriority,
                    }
                  : frontSearch
                    ? comparator
                    : true,
                sortOrder: curSort ? curSort.order : null,
              }
            : {}),
          ...(optimizedColumnsSet.has(col.key!)
            ? {
                shouldCellUpdate(record: RecordType, preRecord: RecordType) {
                  return record !== preRecord;
                },
              }
            : {}),
          render(value: any, record: RecordType, index: number) {
            const data = {
              cellData: value,
              rowData: record,
              /**
               * @deprecated wrong naming, it's actually `rowIndex`
               */
              columnIndex: index,
              rowIndex: index,
              columnKey: col.key,
            };
            return cell?.useBrick ? (
              <CacheUseBrickItem useBrick={cell.useBrick} data={data} />
            ) : col.useBrick ? (
              <CacheUseBrickItem useBrick={col.useBrick} data={data} />
            ) : (
              <>{value}</>
            );
          },
          title() {
            const data = {
              title: col.title,
              columnKey: col.key,
            };
            return cell?.header?.useBrick ? (
              <CacheUseBrickItem useBrick={cell.header.useBrick} data={data} />
            ) : col.headerBrick?.useBrick ? (
              <CacheUseBrickItem
                useBrick={col.headerBrick.useBrick}
                data={data}
              />
            ) : (
              <>{col.title}</>
            );
          },
          onCell(record: RecordType) {
            return {
              colSpan: col.cellColSpanKey
                ? record[col.cellColSpanKey]
                : undefined,
              rowSpan: col.cellRowSpanKey
                ? record[col.cellRowSpanKey]
                : undefined,
              style: {
                ...col.cellStyle,
                verticalAlign: col.verticalAlign,
              },
            };
          },
          onHeaderCell() {
            return {
              style: col.headerStyle,
            };
          },
        };
      });
  }, [
    cell,
    columns,
    hiddenColumns,
    multiSort,
    sort,
    frontSearch,
    optimizedColumns,
  ]);

  const rowSelectionConfig = useMemo(() => {
    if (rowSelection === false || isNil(rowSelection)) {
      return undefined;
    }
    return {
      ...defaultRowSelectionConfig,
      ...(rowSelection === true ? {} : rowSelection),
    };
  }, [rowSelection]);

  const paginationConfig = useMemo(() => {
    if (pagination === false) {
      return false;
    }
    return { ...defaultPaginationConfig, ...pagination };
  }, [pagination]);

  const expandConfig = useMemo(() => {
    if (isTreeData || (!isTreeData && childrenColumnName !== "children")) {
      // still need to set childrenColumnName to antd
      return isPlainObject(expandable) ? expandable : {};
    }
    if (expandable === false || isNil(expandable)) {
      return undefined;
    }
    return isPlainObject(expandable) ? expandable : {};
  }, [expandable, isTreeData, childrenColumnName]);

  useImperativeHandle(ref, () => ({
    search: ({ q }) => {
      const result = searchList({
        q: q?.trim().toLowerCase() || "",
        list: dataSource?.list,
        columns,
        searchFields,
        childrenColumnName,
      });
      setList(result);
      setPageAndPageSize((pre) => {
        if (pre.page !== 1) {
          const newData = {
            page: 1,
            pageSize: pre.pageSize ?? DEFAULT_PAGE_SIZE,
          };
          onPageChange?.(newData);
          return newData;
        }
        return pre;
      });
    },
  }));

  // istanbul ignore next
  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over?.id) {
        setList((prev = []) => {
          const activeIndex = prev.findIndex((v) => v[rowKey] === active.id);
          const overIndex = prev.findIndex((v) => v[rowKey] === over?.id);
          const newList = arrayMove(prev, activeIndex, overIndex);
          onRowDrag?.({
            list: newList,
            active: prev[activeIndex],
            over: prev[overIndex],
          });
          return newList;
        });
      }
    },
    [rowKey, onRowDrag]
  );

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        components: {
          Table: {
            headerBorderRadius: 0,
            headerSplitColor: "none",
            ...(bordered ? { borderColor: "#f0f0f0" } : {}),
          },
        },
      }}
      getPopupContainer={() => shadowRoot as unknown as HTMLElement}
    >
      <StyleProvider
        container={shadowRoot as ShadowRoot}
        cache={styleCache}
        // Set hashPriority to "high" to disable `:where()` usage for compatibility
        hashPriority="high"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[
            restrictToVerticalAxis,
            restrictToFirstScrollableAncestor,
          ]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={keyList}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: rowDraggable && !isTreeData ? DraggableRow : Row,
                },
              }}
              loading={loading}
              rowKey={rowKey}
              columns={processedColumns}
              dataSource={list}
              size={size}
              showHeader={showHeader}
              bordered={bordered}
              scroll={scrollConfig}
              pagination={
                paginationConfig === false
                  ? false
                  : {
                      ...paginationConfig,
                      total: dataSource?.total,
                      current: page,
                      pageSize: pageSize,
                      showTotal: (total: number) => {
                        return (
                          <div className="pagination-wrapper">
                            {paginationConfig.showTotal ? (
                              <span className="pagination-total-text">
                                <Trans
                                  i18nKey={t(K.TOTAL)}
                                  values={{ total }}
                                  components={{
                                    el: (
                                      <strong className="pagination-total-number" />
                                    ),
                                  }}
                                />
                              </span>
                            ) : null}
                            {rowSelectionConfig?.showSelectInfo &&
                            selectedRowKeys?.length ? (
                              <span className="select-info">
                                <span>
                                  {t(K.SELECT_INFO, {
                                    count: selectedRowKeys.length,
                                  })}
                                </span>
                                <WrappedLink
                                  onClick={() => {
                                    setSelectedRowKeys([]);
                                    onRowSelect?.({
                                      keys: [],
                                      rows: [],
                                      info: { type: "none" },
                                    });
                                  }}
                                >
                                  {t(K.CLEAR)}
                                </WrappedLink>
                              </span>
                            ) : null}
                          </div>
                        );
                      },
                    }
              }
              rowSelection={
                rowSelectionConfig === undefined
                  ? undefined
                  : {
                      ...rowSelectionConfig,
                      selectedRowKeys: selectedRowKeys,
                      getCheckboxProps(record: RecordType) {
                        const data = {
                          rowData: record,
                        };
                        return {
                          disabled:
                            rowSelectionConfig.rowDisabled !== undefined
                              ? checkIfByTransform(
                                  { if: rowSelectionConfig.rowDisabled },
                                  data
                                )
                              : false,
                        };
                      },
                      onChange(
                        keys,
                        rows: RecordType[],
                        info: { type: RowSelectMethod }
                      ) {
                        setSelectedRowKeys(keys as (string | number)[]);
                        onRowSelect?.({
                          keys: keys as (string | number)[],
                          rows,
                          info,
                        });
                      },
                    }
              }
              expandable={
                expandConfig === undefined
                  ? undefined
                  : {
                      ...expandConfig,
                      childrenColumnName,
                      expandedRowKeys,
                      rowExpandable(record) {
                        const data = {
                          rowData: record,
                        };
                        return expandConfig.rowExpandable !== undefined
                          ? checkIfByTransform(
                              { if: expandConfig.rowExpandable },
                              data
                            )
                          : true;
                      },
                      expandedRowRender: expandConfig.expandedRowBrick?.useBrick
                        ? (record, index, indent, expanded) => {
                            const data = {
                              rowData: record,
                              index,
                              indent,
                              expanded,
                            };
                            return (
                              <CacheUseBrickItem
                                useBrick={
                                  expandConfig.expandedRowBrick!.useBrick
                                }
                                data={data}
                              />
                            );
                          }
                        : undefined,
                      expandIcon: expandConfig.expandIconBrick?.useBrick
                        ? ({ expanded, expandable, record, onExpand }) => {
                            const data = {
                              rowData: record,
                              expanded,
                              expandable,
                            };
                            return (
                              <span
                                onClick={(e) =>
                                  expandable && onExpand(record, e)
                                }
                              >
                                <CacheUseBrickItem
                                  useBrick={
                                    expandConfig.expandIconBrick!.useBrick
                                  }
                                  data={data}
                                />
                              </span>
                            );
                          }
                        : undefined,
                      onExpand: (expanded, record) => {
                        onRowExpand?.({ expanded, record });
                      },
                      onExpandedRowsChange: (expandedRows) => {
                        const newRows = [...expandedRows] as (
                          | string
                          | number
                        )[];
                        setExpandedRowKeys(newRows);
                        onExpandedRowsChange?.(newRows);
                      },
                    }
              }
              onChange={(pagination, _filters, sorter, extra) => {
                switch (extra.action) {
                  case "paginate": {
                    setPageAndPageSize((pre) => {
                      if (pre.pageSize !== pagination.pageSize) {
                        const newData = {
                          page: 1,
                          pageSize: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
                        };
                        onPageSizeChange?.(newData);
                        onPageChange?.(newData);
                        return newData;
                      } else if (pre.page !== pagination.current) {
                        const newData = {
                          page: pagination.current ?? DEFAULT_PAGE,
                          pageSize: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
                        };
                        onPageChange?.(newData);
                        return newData;
                      }
                      return pre;
                    });
                    break;
                  }
                  case "sort": {
                    const newSort = Array.isArray(sorter)
                      ? sorter
                          .filter((v) => v.order)
                          .map((v) => ({
                            columnKey: v.columnKey as string | number,
                            order: v.order,
                          }))
                      : sorter.order
                        ? {
                            columnKey: sorter.columnKey as string | number,
                            order: sorter.order,
                          }
                        : undefined;
                    setSort(newSort);
                    onSort?.(newSort);
                  }
                }
              }}
              className="next-table"
            />
          </SortableContext>
        </DndContext>
      </StyleProvider>
    </ConfigProvider>
  );
});
