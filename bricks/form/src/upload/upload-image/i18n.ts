export enum K {
  UPLOAD = "UPLOAD",
  FILE_UPLOADING = "FILE_UPLOADING",
}

const en: Locale = {
  UPLOAD: "Upload",
  FILE_UPLOADING: "File is still uploading",
};

const zh: Locale = {
  UPLOAD: "上传",
  FILE_UPLOADING: "文件上传中",
};

export const NS = "bricks/form/upload-image";

export const locales = { en, zh };

type Locale = { [key in K]: string };
