import React, {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Column, RecordType, DataSource, PaginationType } from "./interface.js";
import { Table, ConfigProvider, theme } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import {
  ReactUseMultipleBricks,
  useCurrentTheme,
} from "@next-core/react-runtime";
import { ColumnTitleProps } from "antd/es/table/interface.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { Trans } from "react-i18next";
import { K, NS, locales } from "./i18n.js";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  defaultPaginationConfig,
  getSearchKeywords,
} from "./utils.js";
import { get } from "lodash";

initializeReactI18n(NS, locales);

interface NextTableComponentProps {
  shadowRoot: ShadowRoot | null;
  rowKey?: string;
  columns?: Column[];
  dataSource?: DataSource;
  pagination?: PaginationType;
  hiddenColumns?: (string | number)[];
  searchFields?: (string | string[])[];
  onPageChange?: (detail: { page: number; pageSize: number }) => void;
  onPageSizeChange?: (detail: { page: number; pageSize: number }) => void;
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
    dataSource,
    pagination,
    hiddenColumns,
    searchFields,
    onPageChange,
    onPageSizeChange,
  } = props;

  const { t } = useTranslation(NS);
  const styleCache = useMemo(() => {
    return createCache();
  }, []);
  const currentTheme = useCurrentTheme();

  const [list, setList] = useState<RecordType[] | undefined>(dataSource?.list);
  const [{ page, pageSize }, setPageAndPageSize] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: dataSource?.page ?? DEFAULT_PAGE,
    pageSize: dataSource?.pageSize ?? DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    setList(dataSource?.list);
    setPageAndPageSize({
      page: dataSource?.page ?? DEFAULT_PAGE,
      pageSize: dataSource?.pageSize ?? DEFAULT_PAGE_SIZE,
    });
  }, [dataSource]);

  const processedColumns = useMemo(() => {
    const hiddenColumnsSet = new Set(hiddenColumns);
    return columns
      ?.filter((col) => !hiddenColumnsSet.has(col.key!))
      .map((col) => {
        return {
          ...col,
          render(value: any, record: RecordType, index: number) {
            if (col.useBrick) {
              const data = {
                cellData: value,
                rowData: record,
                columnIndex: index,
              };
              return (
                <ReactUseMultipleBricks useBrick={col.useBrick} data={data} />
              );
            }
            return <>{value}</>;
          },
          title(props: ColumnTitleProps<RecordType>) {
            if (col.headerBrick?.useBrick) {
              const data = {
                title: col.title,
              };
              return (
                <ReactUseMultipleBricks
                  useBrick={col.headerBrick.useBrick}
                  data={data}
                />
              );
            }
            return <>{col.title}</>;
          },
        };
      });
  }, [columns, hiddenColumns]);

  const processedPagination = useMemo(() => {
    if (pagination === false) {
      return false;
    }
    const mergedConfig = { ...defaultPaginationConfig, ...pagination };
    return {
      ...mergedConfig,
      total: dataSource?.total,
      current: page,
      pageSize: pageSize,
      showTotal: mergedConfig.showTotal
        ? (total: number) => {
            return (
              <span className="pagination-total-text">
                <Trans
                  i18nKey={t(K.TOTAL)}
                  values={{ total }}
                  components={{
                    el: <strong className="pagination-total-number" />,
                  }}
                />
              </span>
            );
          }
        : () => null,
    };
  }, [dataSource, pagination, page, pageSize]);

  useImperativeHandle(ref, () => ({
    search: ({ q }) => {
      const _q = q?.trim().toLowerCase() || "";
      let result: RecordType[] | undefined = dataSource?.list;
      if (_q) {
        if (searchFields) {
          result = dataSource?.list?.filter((row) => {
            const keywords = searchFields.flatMap((field) =>
              getSearchKeywords(get(row, field))
            );
            return keywords.some((v) => v.toLowerCase().includes(_q));
          });
        } else {
          result = dataSource?.list?.filter((row) => {
            const keywords = columns?.flatMap((column) => {
              // 嵌套在 dataIndex 中用数组表示，所以 "a.b" 这种要识别成 key: "a.b"。
              const value = Array.isArray(column.dataIndex)
                ? get(row, column.dataIndex)
                : row[column.dataIndex as string];
              return getSearchKeywords(value);
            });
            return keywords?.some((v) => v.toLowerCase().includes(_q));
          });
        }
      }
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

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider container={shadowRoot as ShadowRoot} cache={styleCache}>
        <Table
          rowKey={rowKey}
          columns={processedColumns}
          dataSource={list}
          pagination={processedPagination}
          onChange={(pagination, filters, sorter, extra) => {
            if (extra.action === "paginate") {
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
            }
          }}
        />
      </StyleProvider>
    </ConfigProvider>
  );
});
