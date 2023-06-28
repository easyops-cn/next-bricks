let uid = 0;

export const symbolForAbortController = Symbol.for("AbortController");

export const LIST_IGNORE = Symbol.for("list-ignore");

export const getUid = () => {
  return `upload-image-${+new Date()}-${++uid}`;
};

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

export const sizeValidator = (file: File, limitSize?: number) => {
  return new Promise((resolve, reject) => {
    if (file && limitSize) {
      file.size < limitSize ? resolve(file) : reject(new Error("Wrong size!"));
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
