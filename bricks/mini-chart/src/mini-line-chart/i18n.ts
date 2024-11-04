export enum K {
  NO_DATA = "NO_DATA",
}

const en: Locale = {
  NO_DATA: "No data",
};

const zh: Locale = {
  NO_DATA: "暂无数据",
};

export const NS = "bricks/mini-chart/eo-mini-line-chart";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
