export enum K {
  ICON = "ICON",
  COLOR = "COLOR",
  SELECT_ICON = "SELECT_ICON",
  SEARCH_PLACEHOLDER = "SEARCH_PLACEHOLDER",
}

const en: Locale = {
  ICON: "Icon",
  COLOR: "Color",
  SELECT_ICON: "Select Icon",
  SEARCH_PLACEHOLDER: "input keyword to search",
};

const zh: Locale = {
  ICON: "图标",
  COLOR: "颜色",
  SELECT_ICON: "选择图标",
  SEARCH_PLACEHOLDER: "输入关键字搜索",
};

export const NS = "bricks/form/icon-select";

export const locales = { en, zh };

type Locale = { [key in K]: string };
