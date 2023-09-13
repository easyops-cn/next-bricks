import React, { useMemo } from "react";
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
} from "./utils.js";

initializeReactI18n(NS, locales);

interface NextTableComponentProps {
  shadowRoot: ShadowRoot | null;
  columns?: Column[];
  dataSource?: DataSource;
  pagination?: PaginationType;
  onPageChange?: (detail: { page: number; pageSize: number }) => void;
  onPageSizeChange?: (detail: { page: number; pageSize: number }) => void;
}

export function NextTableComponent(props: NextTableComponentProps) {
  const {
    shadowRoot,
    columns,
    dataSource,
    pagination,
    onPageChange,
    onPageSizeChange,
  } = props;
  const { t } = useTranslation(NS);

  const styleCache = useMemo(() => {
    return createCache();
  }, []);

  const currentTheme = useCurrentTheme();

  const processedColumns = useMemo(() => {
    return columns?.map((col) => {
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
  }, [columns]);

  const processedPagination = useMemo(() => {
    if (pagination === false) {
      return false;
    }
    const mergedConfig = { ...defaultPaginationConfig, ...pagination };
    return {
      ...mergedConfig,
      total: dataSource?.total,
      defaultCurrent: dataSource?.page ?? DEFAULT_PAGE,
      defaultPageSize: dataSource?.pageSize ?? DEFAULT_PAGE_SIZE,
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
      onChange: (page: number, pageSize: number) => {
        onPageChange?.({ page, pageSize });
      },
      onShowSizeChange: (page: number, pageSize: number) => {
        onPageSizeChange?.({ page, pageSize });
      },
    };
  }, [dataSource, pagination, onPageChange, onPageSizeChange]);

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
          columns={processedColumns}
          dataSource={dataSource?.list}
          pagination={processedPagination}
        />
      </StyleProvider>
    </ConfigProvider>
  );
}
