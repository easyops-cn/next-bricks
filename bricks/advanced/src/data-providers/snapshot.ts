// istanbul ignore file: nothing logical except calling html2canvas.
import { http } from "@next-core/http";
import html2canvas from "html2canvas";
import { getBasePath } from "@next-core/runtime";

export type UploadStatus = "uploading" | "done" | "error";

export function capture(selector?: string): Promise<HTMLCanvasElement> {
  const target = selector
    ? document.querySelector(`${selector}`)
    : document.body;
  if (!target) {
    throw new Error(`target not found: ${selector}`);
  }

  return new Promise(function (resolve, reject) {
    html2canvas(document.body, {
      logging: false,
      scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
      width: target ? target.clientWidth : window.innerWidth,
      height: target ? target.clientHeight : window.innerHeight,
      foreignObjectRendering: true,
      allowTaint: true,
      useCORS: true,
      removeContainer: false,
    })
      .then(function (canvas: HTMLCanvasElement) {
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

  const url = `${getBasePath()}api/gateway/object_store.object_store.PutObject/api/v1/objectStore/bucket/${bucketName}/object`;

  return http.request(url, {
    method: "PUT",
    body: formData,
  });
}
