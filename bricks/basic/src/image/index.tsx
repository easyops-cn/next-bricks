import React, { createRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import imageComponentStyleText from "./imageComponent.shadow.css";
import previewStyleText from "./preview.shadow.css";
import "@next-core/theme";
import { ImageList, type ImageConfig, type ImageListRef } from "./ImageList.js";

const { defineElement, property, method, event } = createDecorators();

export interface ImageProps {
  imgList?: ImageConfig[];
  width?: string;
  height?: string;
  onlyPreview?: boolean;
}

export interface ImageEvents {
  visibleChange: CustomEvent<boolean>;
}

export interface ImageEventsMapping {
  onVisibleChange: "visibleChange";
}

export type { ImageConfig };

/**
 * 通用图片构件
 * @en A general-purpose image brick
 * @author nlicro
 * @category display-component
 */
export
@defineElement("eo-image", {
  styleTexts: [imageComponentStyleText, previewStyleText],
  alias: ["basic.general-image"],
})
class EoImage extends ReactNextElement implements ImageProps {
  private _ImageListRef = createRef<ImageListRef>();

  /**
   * 图片列表
   * @en Image list
   */
  @property({ attribute: false }) accessor imgList: ImageConfig[] | undefined;

  /**
   * 图片宽度
   * @en Image width
   */
  @property() accessor width: string | undefined;

  /**
   * 图片高度
   * @en Image height
   */
  @property() accessor height: string | undefined;

  /**
   * 纯预览模式
   * @en Preview-only mode
   */
  @property({
    type: Boolean,
  })
  accessor onlyPreview: boolean | undefined;

  /**
   * 打开预览框
   * @en Open the preview modal
   * @param index 要预览的图片索引，不传则预览第一张
   * @paramEn index Index of the image to preview; the first image is previewed when omitted
   */
  @method()
  open(index?: number): void {
    this._ImageListRef.current?.openPreview(index);
  }

  /**
   * 关闭预览框
   * @en Close the preview modal
   */
  @method()
  close(): void {
    this._ImageListRef.current?.closePreview();
  }

  /**
   * 预览框显示或隐藏时触发
   * @en Triggered when the preview modal is shown or hidden
   * @detail 预览框是否可见
   * @detailEn Whether the preview modal is visible
   */
  @event({ type: "visibleChange" })
  accessor #visibleChange!: EventEmitter<boolean>;
  #handleVisibleChange = (visible: boolean) => {
    this.#visibleChange.emit(visible);
  };

  render() {
    return (
      <ImageList
        ref={this._ImageListRef}
        imgList={this.imgList}
        width={this.width}
        height={this.height}
        onlyPreview={this.onlyPreview}
        onVisibleChange={this.#handleVisibleChange}
      />
    );
  }
}
