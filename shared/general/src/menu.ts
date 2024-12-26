import { Location, parsePath } from "history";
import { matchPath } from "@next-core/runtime";
import type {
  SidebarMenuSimpleItem,
  SidebarMenuItem,
  SidebarMenuGroup,
} from "./types.js";
import { isObject } from "lodash";

export function isGroup(item: SidebarMenuItem): item is SidebarMenuGroup {
  return item.type === "group";
}

export function isSubMenu(
  item: SidebarMenuItem,
  groupAsSubMenu?: boolean
): item is SidebarMenuGroup {
  return Boolean(
    item.type === "subMenu" || (groupAsSubMenu && item.type === "group")
  );
}

export function initMenuItemAndMatchCurrentPathKeys(
  menuItems: SidebarMenuItem[],
  pathname: string,
  search: string,
  parentCursor: string
): {
  selectedKeys: string[];
  openedKeys: string[];
  matchedKeys: string[];
} {
  const selectedKeys: string[] = [];
  const openedKeys: string[] = [];
  const matchedKeys: string[] = [];

  let cursor = 0;
  menuItems &&
    menuItems.forEach((item) => {
      // key的格式最终为0,1,2,0.1,0.2,0.1.1,0.1.2
      item.key =
        parentCursor === "" ? `${cursor}` : `${parentCursor}.${cursor}`;
      if (isGroup(item) || isSubMenu(item)) {
        const tmp = initMenuItemAndMatchCurrentPathKeys(
          item.items,
          pathname,
          search,
          item.key
        );
        selectedKeys.push(...tmp.selectedKeys);
        if (tmp.selectedKeys.length || item.defaultExpanded) {
          openedKeys.push(item.key);
        }
        openedKeys.push(...tmp.openedKeys);
        matchedKeys.push(...tmp.matchedKeys);
      } else {
        if (matchMenuItem(item, pathname, search)) {
          selectedKeys.push(String(item.key));

          const keyPath = item.key.split(".");

          for (let i = 0; i < keyPath.length; i++) {
            matchedKeys.push(keyPath.slice(0, i + 1).join("."));
          }
        }
      }
      cursor += 1;
    });
  if (selectedKeys.length && parentCursor !== "") {
    openedKeys.push(parentCursor);
  }
  return {
    selectedKeys: selectedKeys,
    openedKeys: openedKeys,
    matchedKeys: matchedKeys,
  };
}

function getMatchOfSearch(
  currentSearch: string,
  toSearch: string | undefined
): boolean {
  const current = new URLSearchParams(currentSearch);
  const to = new URLSearchParams(toSearch);
  for (const [key, value] of to.entries()) {
    // Allow `?k=` to match `?` (when `k` doesn't exist)
    if ((current.get(key) ?? "") !== value) {
      return false;
    }
  }
  return true;
}

export function matchMenuItem(
  item: SidebarMenuSimpleItem,
  pathname: string,
  search: string
): boolean {
  if (!item.to) return false;
  const to = typeof item.to === "object" ? item.to : parsePath(item.to);

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
  const escapedPath = to.pathname!.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

  let match = !!matchPath(pathname, {
    path: escapedPath,
    exact: item.exact,
  });

  if (match && item.activeMatchSearch) {
    match = getMatchOfSearch(search, to.search);
  }

  if (!match && Array.isArray(item.activeIncludes)) {
    for (const include of item.activeIncludes) {
      let paths: string[];
      let exact: boolean | undefined = true;

      if (isObject(include)) {
        paths = Array.isArray(include.path) ? include.path : [include.path];
        exact = include.exact;
      } else {
        paths = [include];
      }

      for (const path of paths) {
        let parsedPath: Location | undefined;
        const hasSearch = path.includes("?");

        if (hasSearch) {
          parsedPath = parsePath(path);
        }
        match = !!matchPath(pathname, {
          path: hasSearch ? parsedPath!.pathname : path,
          exact,
        });

        if (match && parsedPath?.search) {
          match = getMatchOfSearch(search, parsedPath.search);
        }

        if (match) {
          break;
        }
      }

      if (match) {
        break;
      }
    }
  }

  if (match && Array.isArray(item.activeExcludes)) {
    for (const include of item.activeExcludes) {
      let paths: string[];
      let exact: boolean | undefined = true;

      if (isObject(include)) {
        paths = Array.isArray(include.path) ? include.path : [include.path];
        exact = include.exact;
      } else {
        paths = [include];
      }

      for (const path of paths) {
        let parsedPathWithSearch: Location | undefined;
        if (path.includes("?")) {
          parsedPathWithSearch = parsePath(path);
        }

        match = !(
          matchPath(pathname, {
            path: parsedPathWithSearch ? parsedPathWithSearch.pathname : path,
            exact,
          }) &&
          (!parsedPathWithSearch ||
            getMatchOfSearch(search, parsedPathWithSearch.search))
        );

        if (!match) {
          break;
        }
      }

      if (!match) {
        break;
      }
    }
  }

  return match;
}
