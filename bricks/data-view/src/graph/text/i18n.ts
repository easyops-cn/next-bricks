export enum K {
  SYMBOL = "SYMBOL",
}

const en: Locale = {
  SYMBOL: ":",
};

const zh: Locale = {
  SYMBOL: "：",
};

export const NS = "bricks/data-view/graph/text";

export const locales = { en, zh };

type Locale = { [key in K]: string };
