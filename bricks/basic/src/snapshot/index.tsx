// istanbul ignore file: nothing logical except calling html2canvas and jspdf.
import React from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import {
  buildImageUrl,
  capture,
  downloadImage,
  getCanvasBlob,
  uploadFile,
} from "./snapshot.js";

const { defineElement, event, method } = createDecorators();

export type SnapshotConf = {
  id?: "string";
  name: string;
};

/**
 * 截图或者截图上传构件
 */
export
@defineElement("eo-snapshot", {
  styleTexts: [styleText],
})
class EoSnapshot extends ReactNextElement {
  /*
   * 保存图片或者PDF时触发
   */
  @event({ type: "save" })
  accessor #onSave!: EventEmitter<{
    fileType: "image" | "pdf";
    status: "saving" | "succeed" | "failed";
  }>;

  /*
   * 上传图片时触发
   */
  @event({ type: "upload" })
  accessor #onUpload!: EventEmitter<{
    url?: string;
    status: "uploading" | "succeed" | "failed";
  }>;

  /*
   * 截图并保存为图片
   */
  @method()
  async saveAsImage(conf: SnapshotConf) {
    try {
      this.#onSave.emit({ fileType: "image", status: "saving" });
      const canvas = await capture();
      await downloadImage(canvas, conf.name);
      this.#onSave.emit({ fileType: "image", status: "succeed" });
    } catch (e) {
      this.#onSave.emit({ fileType: "image", status: "failed" });
    }
  }

  /*
   * 截图并保存为PDF
   */
  @method()
  async saveAsPDF(conf: SnapshotConf) {
    try {
      const { jsPDF } = await import("jspdf");
      this.#onSave.emit({ fileType: "pdf", status: "saving" });
      const canvas = await capture(conf.id);
      const imageData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
      pdf.addImage(imageData, "JPEG", 0, 0, canvas.width, canvas.height);
      await pdf.save(`${conf.name}.pdf`, { returnPromise: true });
      this.#onSave.emit({ fileType: "pdf", status: "succeed" });
    } catch (e) {
      this.#onSave.emit({ fileType: "pdf", status: "failed" });
    }
  }

  /*
   * 截图并上传
   */
  @method()
  async captureImageAndUpload(conf: SnapshotConf & { bucketName: string }) {
    try {
      this.#onUpload.emit({ status: "uploading" });
      const canvas = await capture(conf.id);
      const blob = await getCanvasBlob(canvas);
      const files = new File([blob], `${conf.name}.png`, { type: blob.type });
      const result = await uploadFile(files, conf.bucketName);
      const url = buildImageUrl(conf.bucketName, result.data.objectName);
      this.#onUpload.emit({ url, status: "succeed" });
    } catch (e) {
      this.#onUpload.emit({ status: "failed" });
    }
  }

  render() {
    return null;
  }
}
