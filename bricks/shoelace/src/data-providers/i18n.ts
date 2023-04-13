// istanbul ignore file
export enum K {
  OK = "OK",
  CANCEL = "CANCEL",
}

const en: Locale = {
  OK: "Ok",
  CANCEL: "Cancel",
};

const zh: Locale = {
  OK: "确认",
  CANCEL: "取消",
};

export const NS = "bricks/shoelace/dialog";

export const locales = { en, zh };

type Locale = { [key in K]: string };
