import React, { createRef } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import imageComponentStyleText from "./imageComponent.shadow.css";
import previewStyleText from "./preview.shadow.css";
import "@next-core/theme";
import {
  ImageConfig,
  ImageList,
  ImageListProps,
  ImageListRef,
} from "./ImageList.js";

const { defineElement, property, method, event } = createDecorators();

interface ImageProps {
  imgList?: ImageConfig[];
  width?: string;
  height?: string;
  onlyPreview?: boolean;
}

/**
 * 通用图片构件
 * @author nlicro
 */
@defineElement("eo-image", {
  styleTexts: [imageComponentStyleText, previewStyleText],
  alias: ["basic.general-image"],
})
class Image extends ReactNextElement implements ImageListProps {
  private _ImageListRef = createRef<ImageListRef>();

  /**
   * 图片列表
   */
  @property({ attribute: false }) accessor imgList: ImageConfig[] | undefined;

  /**
   * 图片列表
   */
  @property() accessor width: string | undefined;

  /**
   * 图片列表
   */
  @property() accessor height: string | undefined;

  /**
   * 纯预览模式
   */
  @property({
    type: Boolean,
  })
  accessor onlyPreview: boolean | undefined;

  /**
   * 打开预览框
   */
  @method()
  open(index?: number) {
    this._ImageListRef.current?.openPreview(index);
  }

  /**
   * 关闭预览框
   */
  @method()
  close() {
    this._ImageListRef.current?.closePreview();
  }

  /**
   * 预览改变事件
   * @detail boolean
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

export { Image, ImageProps };
