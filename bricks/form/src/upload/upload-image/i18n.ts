export enum K {
  UPLOAD = "UPLOAD",
}

const en: Locale = {
  UPLOAD: "Upload",
};

const zh: Locale = {
  UPLOAD: "上传",
};

export const NS = "bricks/form/upload-image";

export const locales = { en, zh };

type Locale = { [key in K]: string };
