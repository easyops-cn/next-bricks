export enum K {
  SEARCH_BY_MENU_NAME = "SEARCH_BY_MENU_NAME",
  SEARCH_HISTORY = "SEARCH_HISTORY",
  NO_DATA = "NO_DATA",
}

const en: Locale = {
  SEARCH_BY_MENU_NAME: "Search by menu name",
  SEARCH_HISTORY: "Search history",
  NO_DATA: "No data",
};

const zh: Locale = {
  SEARCH_BY_MENU_NAME: "通过菜单名称搜索",
  SEARCH_HISTORY: "历史搜索",
  NO_DATA: "暂无数据",
};

export const NS = "bricks/basic/nav-menu";

export const locales = { en, zh };

type Locale = { [key in K]: string };
