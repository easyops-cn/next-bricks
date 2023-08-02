import React, { FC, useEffect, useMemo } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./markdown-editor.shadow.css";
import { ObjectStoreApi_putObject } from "@next-api-sdk/object-store-sdk";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { CmdKey } from "@milkdown/core";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import {
  commonmark,
  toggleStrongCommand,
  toggleEmphasisCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  codeBlockSchema,
} from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { history, redoCommand, undoCommand } from "@milkdown/plugin-history";
import { upload, uploadConfig, Uploader } from "@milkdown/plugin-upload";
import { callCommand, $view, replaceAll } from "@milkdown/utils";
import type { Node } from "@milkdown/prose/model";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import {
  gfm,
  toggleStrikethroughCommand,
  insertTableCommand,
} from "@milkdown/preset-gfm";
import { indent } from "@milkdown/plugin-indent";
import { Ctx, MilkdownPlugin } from "@milkdown/ctx";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import {
  usePluginViewFactory,
  ProsemirrorAdapterProvider,
  useWidgetViewFactory,
  useNodeViewFactory,
} from "@prosemirror-adapter/react";
import { refractor } from "refractor/lib/common";
import {
  tableSelectorPlugin,
  TableTooltip,
  tableTooltip,
  tableTooltipCtx,
} from "./components/TableWidget.tsx";
import { CodeBlock } from "./components/CodeBlock.tsx";
import type { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import { FormItemElementBase } from "@next-shared/form";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const MenuButton: FC<MenuButtonProps> = ({ icon, onClick, tooltip }) => {
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

export interface MenuButtonProps {
  icon: GeneralIconProps;
  onClick?: () => void;
  tooltip?: string;
}

export interface MarkdownEditorProps extends FormItemProps {
  value?: string;
  bucketName?: string;
  containerStyle?: React.CSSProperties;
  onUploadImage?: (value: ImageInfo) => void;
  onMarkdownValueChange?: (value: string) => void;
}

export interface ImageInfo {
  name: string;
  src: string;
}

const { defineElement, property, event } = createDecorators();

@defineElement("eo-markdown-editor", {
  styleTexts: [styleText],
  alias: ["markdown.markdown-editor"],
})

/**
 * markdown编辑器
 * @docKind brick
 * @author kehua
 * @noInheritDoc
 */
class MarkdownEditor extends FormItemElementBase {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;

  /**
   * 标签文字
   */
  @property() accessor label: string | undefined;

  /**
   * 是否必填
   */
  @property({ type: Boolean })
  accessor required: boolean | undefined;

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
   * 外层容器样式
   */
  @property({
    attribute: false,
  })
  accessor containerStyle: React.CSSProperties | undefined;

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

  handleMarkdownValueChange = (value: string): void => {
    this.getFormElement()?.formStore.onChange(this.name!, value);
    this.value = value;
    this.#markdownValueChange.emit(value);
  };

  render() {
    return (
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MarkdownEditorComponent
            formElement={this.getFormElement()}
            name={this.name}
            label={this.label}
            required={this.required}
            curElement={this}
            bucketName={this.bucketName}
            value={this.value}
            containerStyle={this.containerStyle}
            onUploadImage={this.handleUploadImage}
            onMarkdownValueChange={this.handleMarkdownValueChange}
          />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    );
  }
}

export { MarkdownEditor };

export function MarkdownEditorComponent(props: MarkdownEditorProps) {
  const {
    bucketName,
    containerStyle,
    value,
    formElement,
    onUploadImage,
    onMarkdownValueChange,
  } = props;

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

  const pluginViewFactory = usePluginViewFactory();
  const widgetViewFactory = useWidgetViewFactory();
  const nodeViewFactory = useNodeViewFactory();

  const gfmPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      gfm,
      tableTooltip,
      tableTooltipCtx,
      (ctx: Ctx) => async () => {
        ctx.set(tableTooltip.key, {
          view: pluginViewFactory({
            component: TableTooltip,
          }),
        });
      },
      tableSelectorPlugin(widgetViewFactory),
    ].flat();
  }, [pluginViewFactory, widgetViewFactory]);

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
        // 支持code代码高亮
        ctx.update(prismConfig.key, (prev: any) => ({
          ...prev,
          configureRefractor: () => refractor,
        }));
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .use(history)
      .use(gfm)
      .use(indent)
      .use(upload)
      .use(gfmPlugins)
      .use(prism)
      .use(
        $view(codeBlockSchema.node, () =>
          nodeViewFactory({ component: CodeBlock })
        )
      );
  }, []);

  useEffect(() => {
    // 当编辑器作为表单项时，初始化完成后需要用form values来初始化
    if (formElement && value) {
      get()?.action(replaceAll(value));
    }
  }, [get(), value]);

  function call<T>(command: CmdKey<T>, payload?: T) {
    return get()?.action(callCommand(command, payload));
  }

  const MenuBtnData: MenuButtonProps[] = [
    {
      icon: { lib: "antd", icon: "undo" },
      onClick: () => call(undoCommand.key),
      tooltip: "撤销",
    },
    {
      icon: { lib: "antd", icon: "redo" },
      onClick: () => call(redoCommand.key),
      tooltip: "重做",
    },
    {
      icon: { lib: "antd", icon: "bold" },
      onClick: () => call(toggleStrongCommand.key),
      tooltip: "粗体",
    },
    {
      icon: { lib: "antd", icon: "italic" },
      onClick: () => call(toggleEmphasisCommand.key),
      tooltip: "斜体",
    },
    {
      icon: { lib: "antd", icon: "strikethrough" },
      onClick: () => call(toggleStrikethroughCommand.key),
      tooltip: "删除线",
    },
    {
      icon: { lib: "antd", icon: "table" },
      onClick: () => call(insertTableCommand.key),
      tooltip: "表格",
    },
    {
      icon: { lib: "antd", icon: "unordered-list" },
      onClick: () => call(wrapInBulletListCommand.key),
      tooltip: "无序列表",
    },
    {
      icon: { lib: "antd", icon: "ordered-list" },
      onClick: () => call(wrapInOrderedListCommand.key),
      tooltip: "有序列表",
    },
    {
      icon: { lib: "fa", icon: "quote-right" },
      onClick: () => call(wrapInBlockquoteCommand.key),
      tooltip: "块引用",
    },
  ];

  return (
    <WrappedFormItem {...props}>
      <div className="markdown-container" style={containerStyle}>
        <div className="menu-container-outter">
          <div className="menu-container-inner prose">
            {MenuBtnData.map((item) => (
              <MenuButton {...item} key={JSON.stringify(item.icon)} />
            ))}
          </div>
        </div>
        <div className="editor-container">
          <Milkdown />
        </div>
      </div>
    </WrappedFormItem>
  );
}
