export enum K {
  TOTAL = "TOTAL",
  SELECT_INFO = "SELECT_INFO",
  CLEAR = "CLEAR",
}

const en: Locale = {
  TOTAL: "Total <el>{{ total }}</el> items",
  SELECT_INFO: "{{ count }} item selected",
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

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
