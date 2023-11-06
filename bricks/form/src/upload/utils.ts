import { i18n } from "@next-core/i18n";
import { NS, K } from "./i18n.js";

let uid = 0;

export const symbolForAbortController = Symbol.for("AbortController");

export const LIST_IGNORE = Symbol.for("list-ignore");

export const getUid = () => {
  return `upload-image-${+new Date()}-${++uid}`;
};

export enum FileSizeUnit {
  KB = "KB",
  MB = "MB",
  GB = "GB",
}

export const acceptValidator = (file: File, accepts?: string | string[]) => {
  const validAccepts = ([] as string[]).concat(accepts || []).reduce(
    (pre, cur) =>
      pre.concat(
        cur
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      ),
    [] as string[]
  );

  if (file && validAccepts.length) {
    const lowerFileName = (file.name || "").toLowerCase();
    const mimeType = file.type || "";
    const baseMimeType = mimeType.split("/")[0];

    return validAccepts.some((accept) => {
      // like *, */*
      if (["*", "*/*"].includes(accept)) {
        return true;
      }

      // like .jpg, .png
      if (accept.startsWith(".")) {
        const lowerType = accept.toLowerCase();
        let affixList = [lowerType];
        if ([".jpg", ".jpeg"].includes(lowerType)) {
          affixList = [".jpg", ".jpeg"];
        }

        return affixList.some((affix) => lowerFileName.endsWith(affix));
      }

      // like image/*
      if (accept.endsWith("/*")) {
        return baseMimeType === accept.split("/*")[0];
      }

      // Full match
      if (mimeType === accept) {
        return true;
      }

      return false;
    });
  }
  return true;
};

export const sizeValidator = (
  file: File,
  limitSize?: number,
  unit: FileSizeUnit = FileSizeUnit.MB
) => {
  return new Promise((resolve, reject) => {
    if (file && limitSize) {
      const sizeConst = {
        [FileSizeUnit.KB]: 1024,
        [FileSizeUnit.MB]: 1024 * 1024,
        [FileSizeUnit.GB]: 1024 * 1024 * 1024,
      };

      file.size < limitSize * sizeConst[unit]
        ? resolve(file)
        : reject(
            new Error(
              i18n.t(`${NS}:${K.EXCEEDED_FILE_SIZE_LIMIT}`, { limitSize, unit })
            )
          );
    } else {
      resolve(file);
    }
  });
};

export type UploadStatus = "uploading" | "done" | "error";

export interface FileData {
  uid: string;
  name: string;
  file?: File & { uid?: string };
  response?: any;
  userData?: any;
  status?: UploadStatus;
  errors?: Error[];
  [symbolForAbortController]?: AbortController;
}
