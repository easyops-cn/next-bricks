// istanbul ignore file: nothing logical except calling html2canvas.
import { http } from "@next-core/http";
import { getBasePath } from "@next-core/runtime";
import _html2canvas from "html2canvas";

// There is a type issue like i18next
const html2canvas = _html2canvas as unknown as typeof _html2canvas.default;
export type UploadStatus = "uploading" | "done" | "error";

export function capture(id?: string): Promise<HTMLCanvasElement> {
  const target = document.querySelector(`#${id}`) || document.body;

  return new Promise(function (resolve, reject) {
    html2canvas(document.body, {
      logging: false,
      scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
      width: target.clientWidth || window.innerWidth,
      height: target.clientHeight || window.innerHeight,
      foreignObjectRendering: true,
      allowTaint: true,
      useCORS: true,
      removeContainer: false,
    })
      .then(function (canvas) {
        resolve(canvas);
      })
      .catch(reject);
  });
}

export function downloadImage(
  canvas: HTMLCanvasElement,
  name = "image"
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const url = canvas.toDataURL("image/png");

      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, image.width, image.height);

        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        const event = new MouseEvent("click");
        a.dispatchEvent(event);
      };
      image.src = url;
      resolve("succeed");
    } catch (e) {
      reject("failed");
    }
  });
}

export function getCanvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob: Blob | null) {
      if (blob) {
        resolve(blob);
      } else {
        reject();
      }
    });
  });
}

export function uploadFile(
  file: File,
  bucketName: string
): Promise<{ data: { objectName: string } }> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const url = `/next/api/gateway/object_store.object_store.PutObject/api/v1/objectStore/bucket/${bucketName}/object`;

  return http.request(url, {
    method: "PUT",
    body: formData,
  });
}

export function buildImageUrl(bucketName: string, objectName: string) {
  return `${getBasePath()}api/gateway/logic.object_store_service/api/v1/objectStore/bucket/${bucketName}/object/${objectName}`;
}
