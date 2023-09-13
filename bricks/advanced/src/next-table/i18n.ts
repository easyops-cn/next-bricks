export enum K {
  TOTAL = "TOTAL",
}

const en: Locale = {
  TOTAL: "Total <el>{{ total }}</el> Items",
};

const zh: Locale = {
  TOTAL: "共 <el>{{ total }}</el> 条",
};

export const NS = "bricks/advanced/eo-next-table";

export const locales = { en, zh };

type Locale = { [key in K]: string };
