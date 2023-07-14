export enum K {
  UPLOAD = "UPLOAD",
  FILE_UPLOADING = "FILE_UPLOADING",
  DRAG_UPLOAD_TEXT = "DRAG_UPLOAD_TEXT",
}

const en: Locale = {
  UPLOAD: "Upload",
  FILE_UPLOADING: "File is still uploading",
  DRAG_UPLOAD_TEXT: "Drag files here or <strong>click to upload</strong>",
};

const zh: Locale = {
  UPLOAD: "上传",
  FILE_UPLOADING: "文件上传中",
  DRAG_UPLOAD_TEXT: "将文件拖动到此处或<strong>点击上传</strong>",
};

export const NS = "bricks/form/eo-upload-file";

export const locales = { en, zh };

type Locale = { [key in K]: string };
