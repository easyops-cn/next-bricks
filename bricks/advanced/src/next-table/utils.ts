import { get, isNil, reduce } from "lodash";
import { Column, RecordType } from "./interface.js";

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

export const defaultPaginationConfig = {
  showSizeChanger: true,
  showTotal: true,
};

export const defaultRowSelectionConfig = {
  preserveSelectedRowKeys: true,
  showSelectInfo: true,
};

export function getSearchKeywords(value: unknown): string[] {
  const result = [];
  if (isNil(value)) {
    // do nothing
  } else if (Array.isArray(value)) {
    value.map((v) => result.push(getSearchKeywords(v)));
  } else if (Object.prototype.toString.call(value) === "[object Object]") {
    for (const k in value as Record<string, any>) {
      result.push(
        String(k),
        getSearchKeywords((value as Record<string, any>)[k])
      );
    }
  } else {
    // string, number, bigint, boolean...
    result.push(String(value));
  }

  return result.flat(Infinity).filter(Boolean) as string[];
}

export function searchList({
  list,
  columns,
  q,
  searchFields,
  childrenColumnName,
}: {
  list?: RecordType[];
  columns?: Column[];
  q?: string;
  searchFields?: (string | string[])[];
  childrenColumnName: string;
}) {
  if (!q) return list;

  return reduce(
    list,
    (pre, row) => {
      let keywords: string[] = [];

      if (searchFields) {
        keywords = searchFields.flatMap((field) =>
          getSearchKeywords(get(row, field))
        );
      } else if (columns) {
        keywords = columns.flatMap((column) => {
          // 嵌套在 dataIndex 中用数组表示，所以 "a.b" 这种要识别成 key: "a.b"。
          const value = Array.isArray(column.dataIndex)
            ? get(row, column.dataIndex)
            : row[column.dataIndex as string];
          return getSearchKeywords(value);
        });
      }

      const selfMatched = keywords.some((v) => v.toLowerCase().includes(q));

      if (selfMatched) {
        return pre.concat(row);
      }

      const filteredChildren = searchList({
        list: row[childrenColumnName],
        columns,
        q,
        searchFields,
        childrenColumnName,
      });
      const childrenMatched = !!filteredChildren?.length;

      if (childrenMatched) {
        const newRow = {
          ...row,
          [childrenColumnName]: filteredChildren,
        } as RecordType;
        return pre.concat(newRow);
      }
      return pre;
    },
    [] as RecordType[]
  );
}

export function isPlainObject(value: unknown): value is Record<string, any> {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function getAllKeys({
  list,
  rowKey,
  childrenColumnName,
}: {
  list?: RecordType[];
  rowKey: string;
  childrenColumnName: string;
}) {
  const keys: (string | number)[] = [];

  list?.forEach((row) => {
    keys.push(row[rowKey]);
    const childrenKeys = getAllKeys({
      list: row[childrenColumnName],
      rowKey,
      childrenColumnName,
    });
    keys.push(...childrenKeys);
  });

  return [...new Set(keys)] as (string | number)[];
}
