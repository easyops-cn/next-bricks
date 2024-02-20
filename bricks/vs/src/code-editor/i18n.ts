export enum K {
  COPY = "COPY",
  COPY_SUCCESS = "COPY_SUCCESS",
  COPY_FAILED = "COPY_FAILED",
  EXPAND = "EXPAND",
  COLLAPSE = "COLLAPSE",
}

const en: Locale = {
  COPY: "Copy",
  COPY_SUCCESS: "Copied!",
  COPY_FAILED: "Copy failed!",
  EXPAND: "Expand",
  COLLAPSE: "Collapse",
};

const zh: Locale = {
  COPY: "复制",
  COPY_SUCCESS: "已复制！",
  COPY_FAILED: "复制失败！",
  EXPAND: "展开",
  COLLAPSE: "收起",
};

export const NS = "bricks/vs/code-editor";

export const locales = { en, zh };

type Locale = { [key in K]: string };
