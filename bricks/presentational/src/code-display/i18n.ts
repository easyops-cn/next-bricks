export enum K {
  COPY_SUCCESS = "COPY_SUCCESS",
  COPY_FAILED = "COPY_FAILED",
}

const en: Locale = {
  COPY_SUCCESS: "Copied!",
  COPY_FAILED: "Copy failed!",
};

const zh: Locale = {
  COPY_SUCCESS: "已成功！",
  COPY_FAILED: "复制失败！",
};

export const NS = "bricks/presentational/code-display";

export const locales = { en, zh };

type Locale = { [key in K]: string };
