import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import { FormItemElement } from "../../../form/src/form-item/FormItemElement.js";
import type {
  FormItem,
  FormItemProps,
} from "../../../form/src/form-item/index.jsx";
import styleText from "./markdown-editor.shadow.css";
import { Editor, rootCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { history } from "@milkdown/plugin-history";
import { upload, uploadConfig, Uploader } from "@milkdown/plugin-upload";
import type { Node } from "@milkdown/prose/model";
import { ObjectStoreApi_putObject } from "@next-sdk/object-store-sdk";

export interface MarkdownEditorProps {
  curElement: HTMLElement;
  supportUploadImg?: boolean;
  bucketName?: string;
  onUploadImage?: (value: ImageInfo) => void;
}

export interface ImageInfo {
  name: string;
  url: string;
}

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

const { defineElement, property, event } = createDecorators();

@defineElement("markdown.markdown-editor", {
  styleTexts: [styleText],
})

/**
 * @id markdown.markdown-editor
 * @name markdown.markdown-editor
 * @docKind brick
 * @description markdown编辑器
 * @author kehua
 * @noInheritDoc
 */
class MarkdownEditor extends FormItemElement {
  /**
   * @kind boolean
   * @required -
   * @default false
   * @description 支持上传图片，为 `true` 时需要设置 `bucketName`。对接平台统一资源存储。
   * @group advanced
   */
  @property() accessor supportUploadImg: boolean | undefined;

  /**
   * @kind string
   * @required -
   * @default -
   * @description 对象存储桶名字，请在业务编排的时候与后台同学商量创建，一般一个业务需求对应一个存储桶名称，相当于 namespace。需要上传图片的功能（`supportUploadImg:true`)时可用。
   * @group advanced
   */
  @property() accessor bucketName: string | undefined;

  /**
   * @detail
   * @description 上传图片时触发的事件
   */
  @event({ type: "image.upload" })
  accessor #uploadImage!: EventEmitter<ImageInfo>;

  private handleUploadImage = (value: ImageInfo): void => {
    this.#uploadImage.emit(value);
  };

  render() {
    return (
      <MilkdownProvider>
        <MarkdownEditorComponent
          curElement={this}
          supportUploadImg={this.supportUploadImg}
          bucketName={this.bucketName}
          onUploadImage={this.handleUploadImage}
        />
      </MilkdownProvider>
    );
  }
}

export { MarkdownEditor };

export function MarkdownEditorComponent(props: MarkdownEditorProps) {
  const { supportUploadImg, bucketName, onUploadImage } = props;

  const transformResponseToUrl = (objectName: string): string => {
    return `/next/api/gateway/object_store.object_store.GetObject/api/v1/objectStore/bucket/${props.bucketName}/object/${objectName}`;
  };

  const uploader: Uploader = async (files: FileList, schema: any) => {
    const images: File[] = [];
    let nodes: Node[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (!file) {
        continue;
      }

      // Only handle image
      if (!file.type.includes("image")) {
        continue;
      }

      images.push(file);
    }

    // upload file
    try {
      nodes = await Promise.all(
        images.map(async (image) => {
          const response = await ObjectStoreApi_putObject(
            bucketName as string,
            {
              file: image,
              width: 1280,
              height: 800,
            }
          );
          const url = transformResponseToUrl(response.objectName as string);
          const alt = image.name;
          onUploadImage && onUploadImage({ name: alt, url });
          return schema.nodes.image.createAndFill({
            url,
            alt,
          }) as Node;
        })
      );
    } catch (err) {
      // do nothing
    }

    return nodes;
  };

  useEditor((root: any) => {
    return Editor.make()
      .config((ctx: any) => {
        ctx.set(rootCtx, root);
      })
      .config(nord)
      .config((ctx: any) => {
        supportUploadImg &&
          bucketName &&
          ctx.update(uploadConfig.key, (prev: any) => ({
            ...prev,
            uploader,
          }));
      })
      .use(commonmark)
      .use(history)
      .use(upload);
  }, []);

  return (
    <WrappedFormItem {...props}>
      <Milkdown />
    </WrappedFormItem>
  );
}
