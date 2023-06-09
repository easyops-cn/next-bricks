export enum K {
  SEARCH_BY_NAME_KEYWORD = "SEARCH_BY_NAME_KEYWORD",
}

const en: Locale = {
  SEARCH_BY_NAME_KEYWORD: "Search by name/keyword",
};

const zh: Locale = {
  SEARCH_BY_NAME_KEYWORD: "通过名称/关键字搜索",
};

export const NS = "bricks/basic/launchpad";

export const locales = { en, zh };

type Locale = { [key in K]: string };
