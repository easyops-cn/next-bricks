import { isNil } from "lodash";

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
