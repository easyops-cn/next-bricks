// istanbul ignore file: nothing logical except calling html2canvas.
import { createProviderClass } from "@next-core/utils/general";
import {
  capture,
  downloadImage,
  getCanvasBlob,
  uploadFile,
  buildImageUrl,
} from "./snapshot.js";
export type SnapshotOptions = {
  /** 文件名称 */
  name: string;
  /** 文件类型 */
  fileType: "image" | "pdf";
  /** 选择器 */
  selector?: string;
  /** 对象存储桶名字, fileType只能为 `image` */
  bucketName?: string;
  /** 画布背景颜色, 默认透明 */
  backgroundColor?: string;
};
/**
 * 截图，保存或上传
 *
 * @param options 选项
 */
export async function captureSnapshot(
  options: SnapshotOptions
): Promise<void | string> {
  const { name, fileType, bucketName, selector, backgroundColor } = options;
  switch (fileType) {
    case "image":
      {
        const canvas = await capture(selector, backgroundColor);
        if (bucketName) {
          const blob = await getCanvasBlob(canvas);
          const files = new File([blob], `${name}.png`, { type: blob.type });
          const result = await uploadFile(files, bucketName);
          return buildImageUrl(bucketName, result.data.objectName);
        } else {
          await downloadImage(canvas, name);
        }
      }
      break;
    case "pdf": {
      const { jsPDF } = await import("jspdf");
      const canvas = await capture(selector, backgroundColor);
      const imageData = canvas.toDataURL("image/jpeg", 1.0);
      const orientation =
        canvas.width > canvas.height ? "landscape" : "portrait";
      const pdf = new jsPDF(orientation, "pt", [canvas.width, canvas.height]);
      pdf.addImage(imageData, "JPEG", 0, 0, canvas.width, canvas.height);
      await pdf.save(`${name}.pdf`, { returnPromise: true });
      break;
    }
    default:
      break;
  }
}

customElements.define(
  "advanced.capture-snapshot",
  createProviderClass(captureSnapshot)
);
