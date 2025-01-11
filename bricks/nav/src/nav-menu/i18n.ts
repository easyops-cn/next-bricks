import { i18n } from "@next-core/i18n";

export enum K {
  SEARCH_BY_MENU_NAME = "SEARCH_BY_MENU_NAME",
  SEARCH_HISTORY = "SEARCH_HISTORY",
  NO_DATA = "NO_DATA",
  QUICK_ACCESS = "QUICK_ACCESS",
  REMOVE_ITEM_FROM_QUICK_ACCESS = "REMOVE_ITEM_FROM_QUICK_ACCESS",
  ADD_ITEM_TO_QUICK_ACCESS = "ADD_ITEM_TO_QUICK_ACCESS",
  NO_DATA_TIPS_IN_QUICK_ACCESS = "NO_DATA_TIPS_IN_QUICK_ACCESS",
  SITE_MAP_SEARCH_RECOMMEND = "SITE_MAP_SEARCH_RECOMMEND",
  MAX_COLLECT_COUNT_TIPS = "MAX_COLLECT_COUNT_TIPS",
  NO_DATA_SEARCH_INFO = "NO_DATA_SEARCH_INFO",
  SEARCH_ITEM_PLACEHOLDER = "SEARCH_ITEM_PLACEHOLDER",
}

const en: Locale = {
  SEARCH_BY_MENU_NAME: "Search by menu name",
  SEARCH_HISTORY: "Search history",
  NO_DATA: "No data",
  QUICK_ACCESS: "Quick Access",
  REMOVE_ITEM_FROM_QUICK_ACCESS: "Remove from Quick Access",
  ADD_ITEM_TO_QUICK_ACCESS: "Add to Quick Access",
  NO_DATA_TIPS_IN_QUICK_ACCESS:
    "No quick access resources have been added yet. Please add from the list below or after searching",
  SITE_MAP_SEARCH_RECOMMEND: "Search recommend",
  MAX_COLLECT_COUNT_TIPS: "Need to delete some favorites in order to add",
  NO_DATA_SEARCH_INFO: "The search result is empty, please enter again",
  SEARCH_ITEM_PLACEHOLDER: "Please enter keywords to search",
};

const zh: Locale = {
  SEARCH_BY_MENU_NAME: "通过菜单名称搜索",
  SEARCH_HISTORY: "历史搜索",
  NO_DATA: "暂无数据",
  QUICK_ACCESS: "快捷访问",
  REMOVE_ITEM_FROM_QUICK_ACCESS: "从快捷访问移除",
  ADD_ITEM_TO_QUICK_ACCESS: "添加至快捷访问",
  NO_DATA_TIPS_IN_QUICK_ACCESS: "暂未添加快捷访问资源，从下方列表或搜索后添加",
  SITE_MAP_SEARCH_RECOMMEND: "搜索推荐",
  MAX_COLLECT_COUNT_TIPS: "需删除部分收藏，才能添加",
  NO_DATA_SEARCH_INFO: "搜索结果为空，请重新输入",
  SEARCH_ITEM_PLACEHOLDER: "请输入关键词搜索",
};

export const NS = "bricks/nav/nav-menu";

export const locales = { en, zh };

export const t = i18n.getFixedT(null, NS);

type Locale = { [key in K]: string };
