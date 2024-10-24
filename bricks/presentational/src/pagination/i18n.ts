export enum K {
  TOTAL = "TOTAL",
  PAGE_SIZE = "PAGE_SIZE",
  NEXT_PAGE_one = "NEXT_PAGE_one",
  NEXT_PAGE_other = "NEXT_PAGE_other",
  PREVIOUS_PAGE_one = "PREVIOUS_PAGE_one",
  PREVIOUS_PAGE_other = "PREVIOUS_PAGE_other",
}

const en: Locale = {
  TOTAL: "Total <total>{{ total }}</total> items",
  PAGE_SIZE: "{{ count }} / page",
  NEXT_PAGE_one: "Next page",
  NEXT_PAGE_other: "Next {{ count }} pages",
  PREVIOUS_PAGE_one: "Previous page",
  PREVIOUS_PAGE_other: "Previous {{ count }} pages",
};

const zh: Locale = {
  TOTAL: "共 <total>{{ total }}</total> 条",
  PAGE_SIZE: "{{ count }} / 页",
  NEXT_PAGE_one: "下一页",
  NEXT_PAGE_other: "向后 {{ count }} 页",
  PREVIOUS_PAGE_one: "上一页",
  PREVIOUS_PAGE_other: "向前 {{ count }} 页",
};

export const NS = "bricks/presentational/eo-pagination";

export const locales = { en, zh };

type Locale = { [key in K]: string };
