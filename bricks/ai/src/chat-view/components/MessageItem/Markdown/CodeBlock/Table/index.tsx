import React, { useMemo, useRef } from "react";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { wrapBrick } from "@next-core/react-element";
import { getBasePath } from "@next-core/runtime";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export type TableColumn = {
  title: string;
  dataIndex: string;
  key: string;
  width?: string;
};

function cmdbInstanceShowName(value: string | string[]): string {
  if (Array.isArray(value)) {
    const firstKey = value[0] || "-"; // 第一个show key为undefined时展示-
    const resKey = value.slice(1, value.length).join(",");
    const res = resKey ? `${firstKey}(${resKey})` : firstKey;
    return res;
  } else {
    return value;
  }
}

function computedTableColumns(data: Record<string, any>[]) {
  const columns: TableColumn[] = [];
  const matchItem = data[0];
  Object.keys(matchItem)?.forEach((key) => {
    columns.push({
      title: key,
      dataIndex: key,
      key: key,
    });
  });
  return columns;
}

export default function TableComponent({
  data: dataSource,
  params,
}: {
  data: Record<string, unknown>[];
  params: {
    objectId: string;
    [k: string]: unknown;
  };
}) {
  const tableContentRef = useRef<HTMLDivElement>(null);

  const toString = (value: any) => {
    if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };

  const columns = useMemo((): TableColumn[] => {
    if (dataSource?.length) {
      return computedTableColumns(dataSource);
    }
    return [];
  }, [dataSource]);

  const getColGroup = useMemo(() => {
    return (
      <colgroup>
        {columns.map((_, index) => {
          return (
            <col
              key={index}
              style={{
                width: 200,
                minWidth: 200,
              }}
            ></col>
          );
        })}
      </colgroup>
    );
  }, [columns]);

  return (
    <div className="table-wrapper">
      {dataSource.length ? (
        <div className="table-container">
          <div className="table-content" ref={tableContentRef}>
            <table>
              {getColGroup}
              <thead>
                <tr>
                  {columns.map((item, index) => {
                    return (
                      <th key={index} className={`${item.key}`}>
                        {item.title}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {dataSource.map((item: any, index) => {
                  return (
                    <tr key={index}>
                      {columns.map((column, tdIndex) => {
                        const content = toString(item[column.key]);
                        return (
                          <td key={tdIndex} title={content}>
                            {column.key === "#showKey"
                              ? cmdbInstanceShowName(item[column.key])
                              : content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {params?.objectId ? (
            <div className="open-more">
              <WrappedLink
                href={`${getBasePath()}next-cmdb-instance-management/next/${params.objectId}/list`}
                target="_blank"
              >
                查看更多
              </WrappedLink>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="empty-tip">无数据</div>
      )}
    </div>
  );
}
