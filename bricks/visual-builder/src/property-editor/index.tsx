import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  createRef,
  useState,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import {
  createForm,
  Form,
  onFieldValueChange,
  onFieldInit,
  onFieldInitialValueChange,
} from "@formily/core";
import { createSchemaField, FormProvider, ISchema } from "@formily/react";
import { ConfigProvider, theme } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import {
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
  Switch,
} from "@formily/antd-v5";
import { useCurrentTheme } from "@next-core/react-runtime";
import { CategoryTitle } from "./components/CategoryTitle";
import { AdvancedFormItem } from "./components/AdvancedFormItem";
import { CodeEditorComponent } from "./components/common/CodeEditorComponent";
import { IconSelectComponent } from "./components/common/IconSelectComponent";
import { __secret_internals, customEditors } from "@next-core/runtime";
import { schemaFormatter } from "./utils/schemaFormatter";
import "./style.css";

const { defineElement, property, method, event } = createDecorators();

const PropertyEditorComponent = React.forwardRef(LegacyPropertyEditor);

const SchemaField = createSchemaField({
  components: {
    FormLayout,
    Input,
    FormItem: AdvancedFormItem,
    NumberPicker,
    Radio,
    Select,
    Switch,
    CategoryTitle,
    CodeEditor: CodeEditorComponent,
    IconSelect: IconSelectComponent,
  },
});

export interface EditorComponentProps {
  SchemaFieldComponent: typeof SchemaField;
  schemaFormatter: (data: ISchema) => ISchema;
  form: Form<any>;
  effects: {
    onFieldInit: typeof onFieldInit;
    onFieldValueChange: typeof onFieldValueChange;
    onFieldInitialValueChange: typeof onFieldInitialValueChange;
    // support any effects
  };
}

/**
 * 构件 `visual-builder.property-editor`
 */
export
@defineElement("visual-builder.property-editor", {
  // styleTexts: [styleText],
  // 因为有使用 vs.code-editor，需要把 shadowOptions 设置成 false
  shadowOptions: false,
  dependencies: ["eo-icon-select", "vs.code-editor", "eo-tooltip"],
})
class PropertyEditor extends ReactNextElement {
  #formRef = createRef<any>();

  @property()
  accessor editorName: string | undefined;

  @property({
    attribute: false,
  })
  accessor values: any | undefined;

  /**
   * 表单验证成功时触发事件
   */
  @event({ type: "validate.success" }) accessor #successEvent!: EventEmitter<
    Record<string, unknown>
  >;
  /**
   * 表单验证报错时触发事件
   */
  @event({ type: "validate.error" }) accessor #errorEvent!: EventEmitter<any[]>;

  @method()
  validate() {
    const form = this.#formRef.current?.getFormInstance();

    form
      .validate()
      .then(() => {
        this.#successEvent.emit({ ...form.values });
      })
      .catch((err: any[]) => {
        this.#errorEvent.emit(err);
      });
  }

  render() {
    return (
      <PropertyEditorComponent
        ref={this.#formRef}
        // shadowRoot={this.shadowRoot}
        editorName={this.editorName}
        values={this.values}
      />
    );
  }
}

export interface PropertyEditorProps {
  shadowRoot?: ShadowRoot;
  values: any;
  editorName: string;
}

export function LegacyPropertyEditor(props: PropertyEditorProps, ref: any) {
  const currentTheme = useCurrentTheme();
  const cache = useMemo(() => createCache(), []);
  const [Editor, setEditor] =
    useState<(props: EditorComponentProps) => React.ReactElement>(null);

  const form = useMemo(() => createForm(), []);

  useEffect(() => {
    if (Editor) {
      form.setInitialValues(props.values);
    }
  }, [form, props.values, Editor]);

  useImperativeHandle(ref, () => ({
    getFormInstance: () => form,
  }));

  const load = async (editorName: string) => {
    // TODO: cache editors
    await __secret_internals.loadEditors([editorName]);
    setEditor(() => customEditors.get(editorName) as any);
  };

  useEffect(() => {
    props.editorName && load(props.editorName);
  }, [props.editorName]);

  if (!Editor) return <div>无数据</div>;

  return (
    <ConfigProvider
      prefixCls="antdV5"
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
      getPopupContainer={(trigger) => trigger!}
    >
      <StyleProvider container={props.shadowRoot} cache={cache}>
        <FormProvider form={form}>
          <Editor
            SchemaFieldComponent={SchemaField}
            form={form}
            effects={{
              onFieldInit,
              onFieldValueChange,
              onFieldInitialValueChange,
            }}
            schemaFormatter={schemaFormatter}
          />
        </FormProvider>
      </StyleProvider>
    </ConfigProvider>
  );
}
