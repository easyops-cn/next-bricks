import { pipes } from "@next-core/pipes";
import { FileData } from "../utils.js";

export interface ImageData extends FileData {
  url?: string;
}

export const getImage = (
  file: string | File,
  revokeUrl?: boolean
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let url = "";
    if (typeof file === "string") {
      url = file;
    } else if (file instanceof Blob && file.type.startsWith("image/")) {
      url = URL.createObjectURL(file);
    } else {
      reject(new Error("not Image"));
    }
    const image = new Image();
    image.src = url;
    image.onload = () => {
      revokeUrl && URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => reject(error);
  });
};

export const imageValidator = async (
  file: File,
  limit?: { width?: number; height?: number }
) => {
  return new Promise((resolve, reject) => {
    if (file && limit) {
      getImage(file, true).then((image) => {
        (limit.width ? image.naturalWidth < limit.width : true) &&
        (limit.height ? image.naturalHeight < limit.height : true)
          ? resolve(file)
          : reject(new Error("Wrong image size!"));
      });
    } else {
      resolve(file);
    }
  });
};

export const userDataProcessor = async (file: File) => {
  const image = await getImage(file);
  return {
    url: image.src,
    name: file.name,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    size: pipes.unitFormat(file.size, "bytes").join(""),
  };
};
