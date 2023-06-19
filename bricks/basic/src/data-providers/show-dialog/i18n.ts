// istanbul ignore file
export enum K {
  OK = "OK",
  CANCEL = "CANCEL",
  DELETE = "DELETE",
}

const en: Locale = {
  OK: "Ok",
  CANCEL: "Cancel",
  DELETE: "Delete",
};

const zh: Locale = {
  OK: "确认",
  CANCEL: "取消",
  DELETE: "删除",
};

export const NS = "bricks/shoelace/dialog";

export const locales = { en, zh };

type Locale = { [key in K]: string };
