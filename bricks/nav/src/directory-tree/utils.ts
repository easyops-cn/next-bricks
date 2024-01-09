import { get, isNil } from "lodash";
import { TreeItem } from "./index";

export function getAllExpandableKeys(data: TreeItem[]): string[] {
  return data.reduce((pre, cur) => {
    const isLeaf = !Array.isArray(cur.children);

    if (!isLeaf) {
      const keys = [cur.key].concat(
        getAllExpandableKeys(cur.children as TreeItem[])
      );
      return pre.concat(keys);
    } else {
      return pre;
    }
  }, [] as string[]);
}

export function getExpandableKeysAccordingToSelectedKeys(
  data: TreeItem[],
  selectedKeysSet: Set<string>
): string[] {
  return data.reduce((pre, cur) => {
    const isLeaf = !Array.isArray(cur.children);

    if (!isLeaf) {
      const childrenMatched = cur.children?.some((child) =>
        selectedKeysSet.has(child.key)
      );
      const childrenExpandableKeys = getExpandableKeysAccordingToSelectedKeys(
        cur.children as TreeItem[],
        selectedKeysSet
      );

      const keys = childrenExpandableKeys.concat(
        childrenMatched || childrenExpandableKeys.length ? [cur.key] : []
      );
      return pre.concat(keys);
    } else {
      return pre;
    }
  }, [] as string[]);
}

export function searchTree(
  data: TreeItem[],
  q: string,
  searchFields: (string | string[])[]
): { data: TreeItem[]; expandedKeys: string[] } {
  if (!q) {
    return { data, expandedKeys: [] };
  }

  const lowerQ = q.toLowerCase();
  const _expandedKeys: string[] = [];
  const _data = data
    .map((item) => {
      const selfMatched = matchItem(item, lowerQ, searchFields);

      if (Array.isArray(item.children)) {
        const childrenSearchResult = searchTree(
          item.children,
          lowerQ,
          searchFields
        );
        const filteredChildren = childrenSearchResult.data;
        const childrenMatched = !!filteredChildren?.length;

        if (childrenMatched) {
          _expandedKeys.push(item.key, ...childrenSearchResult.expandedKeys);

          return {
            ...item,
            children: filteredChildren,
          };
        }
      }

      if (selfMatched) {
        return item;
      }

      return undefined;
    })
    .filter(Boolean) as TreeItem[];
  return { data: _data, expandedKeys: _expandedKeys };
}

function matchItem(
  item: TreeItem,
  lowerQ: string,
  searchFields: (string | string[])[]
): TreeItem | undefined {
  const keywords = searchFields.flatMap((field) =>
    getSearchKeywords(get(item, field))
  );
  const matched = keywords.some((v) => v.toLowerCase().includes(lowerQ));

  if (matched) {
    return item;
  }
  return undefined;
}

function getSearchKeywords(value: unknown): string[] {
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
