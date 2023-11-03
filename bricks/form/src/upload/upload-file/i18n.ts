export enum K {
  UPLOAD = "UPLOAD",
  FILE_UPLOADING = "FILE_UPLOADING",
  DRAG_UPLOAD_TEXT = "DRAG_UPLOAD_TEXT",
  EXCEEDED_FILE_SIZE_LIMIT = "EXCEEDED_FILE_SIZE_LIMIT",
}

const en: Locale = {
  UPLOAD: "Upload",
  FILE_UPLOADING: "File is still uploading",
  DRAG_UPLOAD_TEXT: "Drag files here or <strong>click to upload</strong>",
  EXCEEDED_FILE_SIZE_LIMIT:
    "The uploaded file exceeded size limit: {{limitSize}} {{unit}}",
};

const zh: Locale = {
  UPLOAD: "上传",
  FILE_UPLOADING: "文件上传中",
  DRAG_UPLOAD_TEXT: "将文件拖动到此处或<strong>点击上传</strong>",
  EXCEEDED_FILE_SIZE_LIMIT: "上传的文件超出大小限制: {{limitSize}} {{unit}}",
};

export const NS = "bricks/form/eo-upload-file";

export const locales = { en, zh };

type Locale = { [key in K]: string };
