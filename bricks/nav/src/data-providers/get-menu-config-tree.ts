import { createProviderClass } from "@next-core/utils/general";
import { smartDisplayForEvaluableString } from "@next-shared/general/smartDisplayForEvaluableString";
import { sortBy } from "lodash";

/** 原始菜单数据。 */
export interface MenuRawData {
  menuId: string;
  title: string;
  icon?: unknown;
  type?: "main" | "inject";
  injectMenuGroupId?: string;
  dynamicItems?: boolean;
  itemsResolve?: unknown;
  items?: MenuItemRawData[];
}

/** 原始菜单项数据。 */
export type MenuItemRawData = {
  /** 菜单项文本。 */
  text: string;
  icon?: unknown;
  sort?: number;
  groupId?: string;
  hidden?: boolean;
  children?: MenuItemRawData[];
};

export interface TitleDataSource {
  objectId: string;
  instanceId: string;
  attributeId?: string;
}

interface RuntimeMenuItemRawData extends MenuItemRawData {}

export interface TreeNode {
  key: string;
  title: string;
  icon?: unknown;
  faded?: unknown;
  children?: TreeNode[];
  data: MenuRawData | MenuItemRawData;
  /** 第一个节点额外返回 __keys，包含所有节点的 key */
  __keys?: string[];
}

const DEFAULT_ICON = {
  lib: "fa",
  icon: "bars",
};

/**
 * 构造用于菜单自定义的树形结构数据。
 */
export async function getMenuConfigTree(
  menuList: MenuRawData[]
): Promise<TreeNode[]> {
  const keys: string[] = [];

  function getChildren(
    items: MenuItemRawData[] | undefined,
    prefixKey: string
  ): TreeNode[] | undefined {
    const children = items?.map<TreeNode>((item, j) => {
      const key = `${prefixKey}-${j}`;
      keys.push(key);
      return {
        key,
        title: smartDisplayForEvaluableString(item.text),
        data: item,
        icon: item.icon ?? DEFAULT_ICON,
        faded: item.hidden,
        children: getChildren(item.children, key),
      };
    });
    return children?.length ? children : undefined;
  }

  const mainMenu = menuList.find((menu) => menu.type === "main");
  if (!mainMenu) {
    return [];
  }

  const validMenuList: MenuRawData[] = [];
  const injectWithMenus = new Map<string, MenuRawData[]>();

  for (const menu of menuList) {
    if (!(menu.dynamicItems && menu.itemsResolve) && menu.items?.length) {
      if (menu.type === "inject" && menu.injectMenuGroupId) {
        let injectingMenus = injectWithMenus.get(menu.injectMenuGroupId);
        if (!injectingMenus) {
          injectingMenus = [];
          injectWithMenus.set(menu.injectMenuGroupId, injectingMenus);
        }
        injectingMenus.push(menu);
      } else {
        validMenuList.push(menu);
      }
    }
  }

  keys.push("0");

  const firstLevelItems = reorderMenuItems(
    validMenuList.flatMap(
      (menu) =>
        // Here always have non-empty items
        processGroupInject(menu.items, menu, injectWithMenus)!
    )
  );

  const tree: TreeNode[] = [
    {
      key: "0",
      __keys: keys,
      title: smartDisplayForEvaluableString(mainMenu.title) ?? mainMenu.menuId,
      data: mainMenu,
      icon: mainMenu.icon ?? DEFAULT_ICON,
      children: getChildren(firstLevelItems, "0"),
    },
  ];

  return tree;
}

function processGroupInject(
  items: MenuItemRawData[] | undefined,
  menu: MenuRawData,
  injectWithMenus: Map<string, MenuRawData[]>
): RuntimeMenuItemRawData[] | undefined {
  return items?.map((item) => {
    const foundInjectingMenus =
      item.groupId && injectWithMenus.get(item.groupId);
    if (foundInjectingMenus) {
      // Each menu to be injected with should be injected only once.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      injectWithMenus.delete(item.groupId!);
    }
    return {
      ...item,
      children: (
        processGroupInject(item.children, menu, injectWithMenus) ??
        ([] as RuntimeMenuItemRawData[])
      ).concat(
        foundInjectingMenus
          ? foundInjectingMenus.flatMap(
              (injectingMenu) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                processGroupInject(
                  injectingMenu.items,
                  injectingMenu,
                  injectWithMenus
                )!
            )
          : ([] as RuntimeMenuItemRawData[])
      ),
    };
  });
}

function reorderMenuItems(
  list: MenuItemRawData[] | undefined
): MenuItemRawData[] {
  return sortMenuItems(list).map((item) => ({
    ...item,
    children: reorderMenuItems(item.children),
  }));
}

function sortMenuItems(list: MenuItemRawData[] | undefined): MenuItemRawData[] {
  return sortBy(list, (item) => item.sort ?? -Infinity, "text");
}

customElements.define(
  "nav.get-menu-config-tree",
  createProviderClass(getMenuConfigTree)
);
