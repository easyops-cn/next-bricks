import React, { useCallback, useRef, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { CodeEditorItemWrapper } from './codeEditor.js';
import { CodeEditorProps, HighlightTokenSettings } from "./interfaces.js";
import { isEqual, some } from "lodash";
import { Annotation } from "brace";
import styleText from "./index.shadow.css";
import { FormItemElement } from "../form-item/FormItemElement.js";
import type { FormItem, FormItemProps } from "../form-item/index.js";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "basic.general-form-item"
);

const { defineElement, property, event, } = createDecorators();

export interface Error {
  err: Annotation[];
  hasError: boolean;
}

/**
 * @id basic.code-editor
 * @name basic.code-editor
 * @docKind brick
 * @description 通用输入框构件
 * @author sailor
 * @noInheritDoc
 */
@defineElement("basic.code-editor", {
  styleTexts: [styleText],
})
class CodeEditor extends FormItemElement {
  /**
   * @description
   * @required -
   * @group basic
   */
   @property()
   accessor name: string | undefined;

  /**
   * @description
   * @required -
   * @group basic
   */
  @property()
  accessor label: string | undefined;

  /**
   * @description 代码内容
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor value = "";

  /**
   * @required false
   * @description 选择框占位说明
   * @group basic
   */
  @property()
  accessor placeholder: string | undefined;

  /**
   * @default "monokai"
   * @description 主题，支持 tomorrow、monokai、github
   * @group basic
   */
  @property() accessor theme: string | undefined;
  /**
   * @default "text"
   * @description 语言模式，支持语言如下
   * @group basic
   */
  @property() accessor mode: string = "text";

  /**
   * @default false
   * @description 是否必填
   * @group basic
   */
   @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * @default false
   * @description 是否只能读，不能编辑。如果一个页面同时需要编辑和查看，可以使用该属性，以保证代码构件的一致性。而如果一个页面只有查看的功能，建议直接使用轻量级[代码展示构件 code-bricks.code-display](developers/brick-book/brick/code-bricks.code-display)，避免代码内容过多的时候页面卡顿。
   * @group basic
   */
  @property({
    type: Boolean,
  })
  accessor readOnly: boolean | undefined;

  /**
   * @description 是否显示行号
   * @group ui
   */
  @property({
    type: Boolean,
  })
  accessor showLineNumbers = true;

  /**
   * @description 最大行号，超出就显示滚动条，注意应该为正数或者无穷大
   * @group ui
   */
  @property({
    attribute: false,
  })
  accessor maxLines: number | "Infinity" | undefined;

  /**
   * @description 最小行号，即最小高度为多少行
   * @group ui
   */
  @property({
    type: Number,
  })
  accessor minLines = 3;

  /**
   * @description 一个 tab 代表多少个空格
   * @group other
   */
  @property({
    type: Number,
  })
  accessor tabSize = 2;

  /**
   * @required false
   * @description 显示打印边距
   * @group ui
   */
  @property({
    type: Boolean,
  })
  accessor printMargin: boolean | undefined;

  /**
   * @description 高亮激活的行
   * @group other
   */
  @property({
    type: Boolean,
  })
  accessor highlightActiveLine = true;

  /**
   * @default false
   * @description 是否显示导出按钮
   * @group ui
   */
  @property({
    type: Boolean,
  })
  accessor showExportButton: boolean | undefined;

  /**
   * @description 是否显示复制按钮
   * @group ui
   */
  @property({
    type: Boolean,
  })
  accessor showCopyButton = true;

  /**
   * @description 是否显示展开按钮
   * @group ui
   */
  @property({ type: Boolean })
  accessor showExpandButton: boolean | undefined;

  /**
   * @default "download.txt"
   * @description 当 `showExportButton = true` 时， 配置导出的文件名称, 默认为 download.txt
   * @group other
   */
  @property()
  accessor exportFileName: string | undefined;

  /**
   * @description json schema，当 mode 为 json,yaml,brick_next,brick_next_yaml 时会根据该 json schema 进行校验
   * @group other
   */
  @property({
    attribute: false,
  })
  accessor jsonSchema: Record<string, any> | undefined;

  /**
   * @description 校验 Json Schema 的模式，warning 为告警模式，仅作告警提示，不影响表单提交；error 为错误模式，将会阻止表单提交错误内容。
   * @group other
   */
  @property()
  accessor validateJsonSchemaMode: "warning" | "error" = "warning";

  /**
   * @description json schema $ref，设置该属性后会验证 json schema 中对应 $ref 指向的部分片段，以 # 开头代表根节点，例如可以设置成 `#/definitions/BrickConf`
   * @group other
   */
  @property()
  accessor schemaRef: string | undefined;

  /**
   * @default false
   * @description 是否开启自动补全
   * @group other
   */
  @property({
    type: Boolean,
  })
  accessor enableLiveAutocompletion: boolean | undefined;

  /**
   * @description 自定义自动补全，注意当`enableLiveAutocompletion:true`时才能生效
   * @group other
   */
  @property({
    attribute: false,
  })
  accessor customCompleters:
    | string[]
    | {
        caption?: string;
        value: string;
        meta?: string;
        score?: number;
      }[]
    | undefined;
  /**
   * @description 是否与JSON解析行为一致，如果设为`true`，有重复key时取最后一个的value，如果设为`false`，有重复key时会抛出错误
   * @group other
   */
  @property({
    type: Boolean
  })
  accessor loadYamlInJsonMode = true;

  /**
   * @description 高亮标记设置。
   * @group other
   */
  @property({
    attribute: false,
  })
  accessor highlightTokens: HighlightTokenSettings[] | undefined;

  #previousError: Error = {
    err: [],
    hasError: false,
  };

  /**
   * @description 值变化的时候发出的事件，detail 为值
   */
  @event({ type: "code.change" })
  accessor #codeChangeEvent!: EventEmitter<string>;
  private _handleChange = (value: string): void => {
    this.value = value;
    this.#codeChangeEvent.emit(value)
  };
  /**
   * @description 编辑器失去焦点的时候发出的事件，detail 为值
   */
  @event({ type: "editor.blur" })
  accessor #blurEvent!: EventEmitter<string>;
  private _handleBlur = (): void => {
    this.#blurEvent.emit(this.value);
  };
  /**
   * @detail `{err:Record<string,any>[],hasError:boolean}`
   * @description 值错误变化的时候发出的事件，err 为具体错误信息，hasError 为是否有错误
   */
  @event({ type: "error.change" })
  accessor #errorChangeEvent!: EventEmitter<Error>;
  private _handleErrorChange = (error: Error): void => {
    if (!isEqual(error, this.#previousError)) {
      this.#errorChangeEvent.emit(error);
      this.#previousError = error;
    }
  };

  /**
   * @description 当高亮标记被点击时触发。该事件会冒泡。
   */
  @event({ type: "highlightToken.click", bubbles: true })
  accessor #highlightTokenClickEvent!: EventEmitter<{
    type: string;
    value: string;
  }>;

  private _handleHighlightTokenClick = (token: {
    type: string;
    value: string;
  }): void => {
    this.#highlightTokenClickEvent.emit(token);
  };

  render() {
    return <CodeEditorComponent
      curElement={this}
      formElement={this.getFormElement()}
      name={this.name}
      label={this.label}
      placeholder={this.placeholder}
      value={this.value}
      required={this.required}
      onChange={this._handleChange}
      trigger="_handleChange"
      onBlur={this._handleBlur}
      onErrorChange={this._handleErrorChange}
      theme={this.theme}
      mode={this.mode}
      readOnly={this.readOnly}
      showLineNumbers={this.showLineNumbers}
      maxLines={this.maxLines}
      minLines={this.minLines}
      tabSize={this.tabSize}
      printMargin={this.printMargin}
      highlightActiveLine={this.highlightActiveLine}
      showCopyButton={this.showCopyButton}
      showExportButton={this.showExportButton}
      showExpandButton={this.showExpandButton}
      exportFileName={this.exportFileName}
      jsonSchema={this.jsonSchema}
      validateJsonSchemaMode={this.validateJsonSchemaMode}
      schemaRef={this.schemaRef}
      enableLiveAutocompletion={this.enableLiveAutocompletion}
      customCompleters={this.customCompleters}
      loadYamlInJsonMode={this.loadYamlInJsonMode}
      highlightTokens={this.highlightTokens}
      onClickHighlightToken={this._handleHighlightTokenClick}
    />;
  }
}

export function CodeEditorComponent(props: CodeEditorProps) {
  const isError = useRef<boolean>();
  const hasJsonSchemaError = useRef<boolean>();

  const getMessage = useCallback((): string => {
    return isError.current ? hasJsonSchemaError.current
          ? "请填写正确的数据结构"
          : `请填写正确的 ${
              props.mode === "brick_next"
                ? "json"
                : props.mode === "brick_next_yaml" || props.mode === "cel_yaml"
                ? "yaml"
                : props.mode
            } 语法` : "";
  }, [props.mode])

  const handleValidator = useCallback(() => {
    if (isError.current) {
      const message = {
        message: getMessage(),
        type: "error",
      }
      return message;
    } else {
      return "";
    }
  }, [getMessage, props.formElement, props.name])

  const onValidate = (err: Annotation[]): void => {
    const error = some(err, ["type", "error"]);
    if (error) {
      const jsonSchemaError =
        props.validateJsonSchemaMode === "error" &&
        some(err, (v: any) => v.type === "error" && v.raw?.length > 0);
      isError.current = true;
      hasJsonSchemaError.current = jsonSchemaError;
      props.formElement?.validateField(props.name as string);
    } else {
      isError.current = false;
      hasJsonSchemaError.current = false;
    }
    props.onErrorChange && props.onErrorChange({ err, hasError: error });
  };

  return (
    <WrappedFormItem {...props as FormItemProps} validator={handleValidator}>
      <CodeEditorItemWrapper
        {...props}
        onValidate={props.onValidate ? props.onValidate : onValidate}
      />
    </WrappedFormItem>
  );
}

export { CodeEditor };
