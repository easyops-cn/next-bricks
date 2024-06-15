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
  FormCollapse,
  FormItem,
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
import {
  ADVANCED_FORM_KEY,
  DataNode,
  formilySchemaFormatter,
} from "./utils/formilySchemaFormatter";
import "./style.css";
import yaml from "js-yaml";
import _ from "lodash";

const { defineElement, property, method, event } = createDecorators();

const PropertyEditorComponent = React.forwardRef(LegacyPropertyEditor);

const SchemaField = createSchemaField({
  components: {
    FormLayout,
    Input,
    FormItem: AdvancedFormItem,
    FormItemWithoutAdvanced: FormItem,
    FormCollapse,
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
  advancedMode?: boolean;
  SchemaFieldComponent: typeof SchemaField;
  formilySchemaFormatter: (data: DataNode, advancedMode: boolean) => ISchema;
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

  /** 构件名称 */
  @property()
  accessor editorName: string | undefined;

  /** 值 */
  @property({
    attribute: false,
  })
  accessor values: any | undefined;

  /** 高级模式 */
  @property({
    type: Boolean,
  })
  accessor advancedMode: boolean | undefined;

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
        const realValue = this.advancedMode
          ? yaml.load(form.values[ADVANCED_FORM_KEY])
          : _.omit(form.values, [ADVANCED_FORM_KEY]);
        this.#successEvent.emit({ ...realValue });
      })
      .catch((err: any[]) => {
        this.#errorEvent.emit(err);
      });
  }

  render() {
    return (
      <PropertyEditorComponent
        ref={this.#formRef}
        editorName={this.editorName}
        values={this.values}
        advancedMode={this.advancedMode}
      />
    );
  }
}

export interface PropertyEditorProps {
  values: any;
  editorName: string;
  advancedMode?: boolean;
}

export function LegacyPropertyEditor(
  { advancedMode, values, editorName }: PropertyEditorProps,
  ref: any
) {
  const currentTheme = useCurrentTheme();
  const cache = useMemo(() => createCache(), []);
  const form = useMemo(() => createForm(), []);
  const [Editor, setEditor] =
    useState<(props: EditorComponentProps) => React.ReactElement>(null);

  useImperativeHandle(ref, () => ({
    getFormInstance: () => form,
  }));

  const load = async (editorName: string) => {
    // TODO: cache editors
    await __secret_internals.loadEditors([editorName]);
    setEditor(() => customEditors.get(editorName) as any);
  };

  useEffect(() => {
    editorName && load(editorName);
  }, [editorName]);

  useEffect(() => {
    if (Editor) {
      form.setInitialValues(values);
    }
  }, [form, values, Editor]);

  useEffect(() => {
    const { values } = form.getState();
    if (advancedMode) {
      form.setValuesIn(
        ADVANCED_FORM_KEY,
        _.isEmpty(values)
          ? ""
          : yaml.safeDump(_.omit(values, [ADVANCED_FORM_KEY]))
      );
    } else {
      const realValue = values[ADVANCED_FORM_KEY];
      if (realValue) {
        form.setValues(yaml.safeLoad(realValue));
      } else {
        form.setValues(values);
      }
    }
  }, [advancedMode, form]);

  if (!Editor) return <div>无数据</div>;

  return (
    <div className="property-form-wrapper">
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
        <StyleProvider cache={cache}>
          <FormProvider form={form}>
            <Editor
              advancedMode={advancedMode}
              SchemaFieldComponent={SchemaField}
              form={form}
              effects={{
                onFieldInit,
                onFieldValueChange,
                onFieldInitialValueChange,
              }}
              formilySchemaFormatter={formilySchemaFormatter}
            />
          </FormProvider>
        </StyleProvider>
      </ConfigProvider>
    </div>
  );
}
