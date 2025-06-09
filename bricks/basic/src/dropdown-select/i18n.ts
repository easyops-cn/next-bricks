import { i18n } from "@next-core/i18n";

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

export const t = i18n.getFixedT(null, NS);

type Locale = { [key in K]: string };
