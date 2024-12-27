import type { MetaI18n, MicroApp } from "@next-core/types";
import { i18n } from "@next-core/i18n";
import { createProviderClass } from "@next-core/utils/general";
import { sortBy } from "lodash";
import { smartDisplayForMenuTitle } from "./shared/smartDisplayForMenuTitle";

const symbolMenuI18nNamespace = Symbol("menuI18nNamespace");
const symbolOverrideApp = Symbol("overrideApp");

/** 原始菜单数据。 */
export interface MenuRawData {
  menuId: string;
  title: string;
  icon?: {
    imgSrc?: string;
  };
  type?: "main" | "inject";
  injectMenuGroupId?: string;
  dynamicItems?: boolean;
  itemsResolve?: unknown;
  items?: MenuItemRawData[];
  instanceId: string;
  app: [
    {
      appId: string;
    },
  ];
  i18n?: MetaI18n;
  overrideApp?: MicroApp;
}

/** 原始菜单项数据。 */
export type MenuItemRawData = {
  /** 菜单项文本。 */
  text: string;
  icon?: {
    imgSrc?: string;
  };
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

interface RuntimeMenuItemRawData extends MenuItemRawData {
  children?: RuntimeMenuItemRawData[];
  [symbolMenuI18nNamespace]?: string;
  [symbolOverrideApp]?: MicroApp;
}

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
 *
 * 将对菜单标题进行表达式解析，支持 I8N 和 APP。
 */
export async function getMenuConfigTree(
  menuList: MenuRawData[]
): Promise<TreeNode[]> {
  const keys: string[] = [];

  function getChildren(
    items: RuntimeMenuItemRawData[] | undefined,
    prefixKey: string
  ): TreeNode[] | undefined {
    const children = items?.map<TreeNode>((item, j) => {
      const key = `${prefixKey}-${j}`;
      keys.push(key);
      return {
        key,
        title:
          smartDisplayForMenuTitle(
            item.text,
            item[symbolMenuI18nNamespace],
            item[symbolOverrideApp]
          ) ?? "",
        data: item,
        icon: getIcon(item.icon),
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
  const menuWithI18n = new WeakMap<MenuRawData, string>();

  for (const menu of menuList) {
    const menuI18nNamespace = `customize-menu/${menu.menuId}~${menu.app[0].appId}+${
      menu.instanceId
    }`;
    // Support any language in `menu.i18n`.
    Object.entries(menu.i18n ?? {}).forEach(([lang, resources]) => {
      i18n.addResourceBundle(lang, menuI18nNamespace, resources);
    });
    menuWithI18n.set(menu, menuI18nNamespace);
  }

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
        processGroupInject(menu.items, menu, injectWithMenus, menuWithI18n)!
    )
  );

  const tree: TreeNode[] = [
    {
      key: "0",
      __keys: keys,
      title:
        smartDisplayForMenuTitle(
          mainMenu.title,
          menuWithI18n.get(mainMenu),
          mainMenu.overrideApp
        ) ?? mainMenu.menuId,
      data: mainMenu,
      icon: getIcon(mainMenu.icon),
      children: getChildren(firstLevelItems, "0"),
    },
  ];

  return tree;
}

function getIcon(icon: { imgSrc?: string } | undefined): unknown {
  // 使用图片图标时，该图标一般是表达式，是应用的运行时数据，菜单管理无法获取。
  if (icon?.imgSrc) {
    return DEFAULT_ICON;
  }
  return icon ?? DEFAULT_ICON;
}

function processGroupInject(
  items: MenuItemRawData[] | undefined,
  menu: MenuRawData,
  injectWithMenus: Map<string, MenuRawData[]>,
  menuWithI18n: WeakMap<MenuRawData, string>
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
        processGroupInject(
          item.children,
          menu,
          injectWithMenus,
          menuWithI18n
        ) ?? ([] as RuntimeMenuItemRawData[])
      ).concat(
        foundInjectingMenus
          ? foundInjectingMenus.flatMap(
              (injectingMenu) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                processGroupInject(
                  injectingMenu.items,
                  injectingMenu,
                  injectWithMenus,
                  menuWithI18n
                )!
            )
          : ([] as RuntimeMenuItemRawData[])
      ),
      [symbolOverrideApp]: menu.overrideApp,
      [symbolMenuI18nNamespace]: menuWithI18n.get(menu),
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
