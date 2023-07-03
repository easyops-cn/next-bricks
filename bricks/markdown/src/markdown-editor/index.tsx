import React, { FC } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import type { CmdKey } from "@milkdown/core";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./markdown-editor.shadow.css";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import {
  commonmark,
  toggleStrongCommand,
  toggleEmphasisCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
} from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { history, redoCommand, undoCommand } from "@milkdown/plugin-history";
import { upload, uploadConfig, Uploader } from "@milkdown/plugin-upload";
import { callCommand } from "@milkdown/utils";
import type { Node } from "@milkdown/prose/model";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { ObjectStoreApi_putObject } from "@next-api-sdk/object-store-sdk";
import {
  gfm,
  toggleStrikethroughCommand,
  insertTableCommand,
} from "@milkdown/preset-gfm";
import { indent } from "@milkdown/plugin-indent";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

const Button: FC<{
  icon: GeneralIconProps;
  onClick?: () => void;
  tooltip?: string;
}> = ({ icon, onClick, tooltip }) => {
  return (
    <div
      className="menu-btn-box"
      onMouseDown={(e) => {
        onClick?.();
        e.preventDefault();
      }}
    >
      <WrappedIcon style={{ verticalAlign: "middle" }} {...icon} />
      {tooltip && <div className="menuIconTooltip">{tooltip}</div>}
    </div>
  );
};

export interface MarkdownEditorProps {
  curElement: HTMLElement;
  value?: string;
  bucketName?: string;
  onUploadImage?: (value: ImageInfo) => void;
  onMarkdownValueChange?: (value: string) => void;
}

export interface ImageInfo {
  name: string;
  src: string;
}

const { defineElement, property, event } = createDecorators();

@defineElement("markdown.markdown-editor", {
  styleTexts: [styleText],
})

/**
 * markdown编辑器
 * @docKind brick
 * @author kehua
 * @noInheritDoc
 */
class MarkdownEditor extends ReactNextElement {
  /**
   * 初始值
   * @group basic
   */
  @property() accessor value: string | undefined;

  /**
   * 对象存储桶名字，请在业务编排的时候与后台同学商量创建，一般一个业务需求对应一个存储桶名称。如不传则默认以base64格式转换图片
   * @group advanced
   */
  @property() accessor bucketName: string | undefined;

  /**
   * 上传图片时触发的事件
   * @detail
   */
  @event({ type: "image.upload" })
  accessor #uploadImage!: EventEmitter<ImageInfo>;

  private handleUploadImage = (value: ImageInfo): void => {
    this.#uploadImage.emit(value);
  };

  /**
   * 编辑markdown触发的变化事件
   * @detail
   */
  @event({ type: "markdown.value.change" })
  accessor #markdownValueChange!: EventEmitter<string>;

  private handleMarkdownValueChange = (value: string): void => {
    this.#markdownValueChange.emit(value);
  };

  render() {
    return (
      <MilkdownProvider>
        <MarkdownEditorComponent
          curElement={this}
          bucketName={this.bucketName}
          value={this.value}
          onUploadImage={this.handleUploadImage}
          onMarkdownValueChange={this.handleMarkdownValueChange}
        />
      </MilkdownProvider>
    );
  }
}

export { MarkdownEditor };

export function MarkdownEditorComponent(props: MarkdownEditorProps) {
  const { bucketName, value, onUploadImage, onMarkdownValueChange } = props;

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
          const response: any = await ObjectStoreApi_putObject(
            bucketName as string,
            {
              file: image,
              width: 1280,
              height: 800,
            }
          );
          const src = transformResponseToUrl(response?.objectName as string);
          const alt = image.name;
          onUploadImage && onUploadImage({ name: alt, src });
          return schema.nodes.image.createAndFill({
            src,
            alt,
          }) as Node;
        })
      );
    } catch (err) {
      // do nothing
    }

    return nodes;
  };

  const { get } = useEditor((root: any) => {
    return Editor.make()
      .config((ctx: any) => {
        // 配置root
        ctx.set(rootCtx, root);
        // 配置默认值
        value && ctx.set(defaultValueCtx, value);
        // 配置事件监听
        ctx
          .get(listenerCtx)
          .markdownUpdated(
            (ctx: any, markdown: string, prevMarkdown: string) => {
              onMarkdownValueChange && onMarkdownValueChange(markdown);
            }
          );
        // 配置文件上传,不传bucketName则默认把图片转为base64格式
        bucketName &&
          ctx.update(uploadConfig.key, (prev: any) => ({
            ...prev,
            uploader,
          }));
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .use(history)
      .use(gfm)
      .use(indent)
      .use(upload);
  }, []);

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload));
  }

  return (
    <div className="markdown-container">
      <div className="menu-container-outter">
        <div className="menu-container-inner prose">
          <Button
            icon={{ lib: "antd", icon: "undo" }}
            onClick={() => call(undoCommand.key)}
            tooltip="撤销"
          />
          <Button
            icon={{ lib: "antd", icon: "redo" }}
            onClick={() => call(redoCommand.key)}
            tooltip="重做"
          />
          <Button
            icon={{ lib: "antd", icon: "bold" }}
            onClick={() => call(toggleStrongCommand.key)}
            tooltip="粗体"
          />
          <Button
            icon={{ lib: "antd", icon: "italic" }}
            onClick={() => call(toggleEmphasisCommand.key)}
            tooltip="斜体"
          />
          <Button
            icon={{ lib: "antd", icon: "strikethrough" }}
            onClick={() => call(toggleStrikethroughCommand.key)}
            tooltip="删除线"
          />
          <Button
            icon={{ lib: "antd", icon: "table" }}
            onClick={() => call(insertTableCommand.key)}
            tooltip="表格"
          />
          <Button
            icon={{ lib: "antd", icon: "unordered-list" }}
            onClick={() => call(wrapInBulletListCommand.key)}
            tooltip="无序列表"
          />
          <Button
            icon={{ lib: "antd", icon: "ordered-list" }}
            onClick={() => call(wrapInOrderedListCommand.key)}
            tooltip="有序列表"
          />
          <Button
            icon={{ lib: "fa", icon: "quote-right" }}
            onClick={() => call(wrapInBlockquoteCommand.key)}
            tooltip="块引用"
          />
        </div>
      </div>
      <div className="editor-container">
        <Milkdown />
      </div>
    </div>
  );
}
