export enum K {
  PLEASE_SELECT = "PLEASE_SELECT",
}

const en: Locale = {
  PLEASE_SELECT: "Please select",
};

const zh: Locale = {
  PLEASE_SELECT: "请选择",
};

export const NS = "bricks/basic/eo-dropdown-select";

export const locales = { en, zh };

type Locale = { [key in K]: string };
