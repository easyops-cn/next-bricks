export enum K {
  TOTAL = "TOTAL",
  SELECT_INFO = "SELECT_INFO",
  CLEAR = "CLEAR",
}

const en: Locale = {
  TOTAL: "Total <el>{{ total }}</el> Items",
  SELECT_INFO: "{{ count }} item selected",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  SELECT_INFO_plural: "{{ count }} items selected",
  CLEAR: "Clear",
};

const zh: Locale = {
  TOTAL: "共 <el>{{ total }}</el> 条",
  SELECT_INFO: "已选择 {{ count }} 项",
  CLEAR: "清空",
};

export const NS = "bricks/advanced/eo-next-table";

export const locales = { en, zh };

type Locale = { [key in K]: string };
