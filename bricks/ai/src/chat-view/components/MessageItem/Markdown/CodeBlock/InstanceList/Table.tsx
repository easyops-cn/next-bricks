import React, { useMemo, useRef } from "react";

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

export function TableComponent({
  columns,
  dataSource,
}: {
  columns: TableColumn[];
  dataSource: Record<string, unknown>[];
}) {
  const tableContentRef = useRef<HTMLDivElement>(null);

  const toString = (value: any) => {
    if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };

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
    <div className="instance-list-table-wrapper">
      <div className="result-tip">【查询结果】:</div>
      {dataSource.length ? (
        <div className="table-wrapper">
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
        </div>
      ) : (
        <div className="empty-tip">【无数据】</div>
      )}
    </div>
  );
}
