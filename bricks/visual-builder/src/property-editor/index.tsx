import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  createRef,
  useState,
  useCallback,
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
  onFormInitialValuesChange,
  onFormValidateSuccess,
  onFormValuesChange,
  createEffectHook,
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

const BEFORE_SUBMIT_KEY = "before_submit";

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
  formilySchemaFormatter: (data: any, advancedMode?: boolean) => ISchema;
  form: Form<any>;
  effects: {
    onFieldInit: typeof onFieldInit;
    onFieldValueChange: typeof onFieldValueChange;
    onFieldInitialValueChange: typeof onFieldInitialValueChange;
    onFormInitialValuesChange: typeof onFormInitialValuesChange;
    onFormValidateSuccess: typeof onFormValidateSuccess;
    onSubmit: (listener: (form: Form) => any) => void;
    // support any effects
  };
  scope: {
    advancedMode: boolean;
    dataList: DataItem[];
  };
}

export interface DefinitionItem {
  name: string;
  type: string;
  enum: string;
  fileds: DefinitionItem[];
}

export interface DataItem {
  name: string;
  value: string;
  definition: DefinitionItem[];
  [k: string]: any;
}

export { DataNode };

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

  @property({
    attribute: false,
  })
  accessor dataList: DataItem[];

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
    const form: Form = this.#formRef.current?.getFormInstance();
    this.#submitValue = null;

    form
      .validate()
      .then(() => {
        form.notify(BEFORE_SUBMIT_KEY);
        if (this.#submitValue) {
          return this.#submitValue;
        }

        const realValue = this.advancedMode
          ? yaml.load(form.values[ADVANCED_FORM_KEY])
          : _.omit(form.values, [ADVANCED_FORM_KEY]);

        this.#successEvent.emit({ ...realValue });
      })
      .catch((err: any[]) => {
        this.#errorEvent.emit(err);
      });
  }

  @event({ type: "values.change" })
  accessor #valuesChangeEvent!: EventEmitter<any>;

  #handleValuesChange = (value: any) => {
    this.#valuesChangeEvent.emit(value);
  };

  #submitValue: any;

  #onSubmitEffect = createEffectHook(
    BEFORE_SUBMIT_KEY,
    (form) => (listener) => {
      this.#submitValue = listener(form);
    }
  );

  render() {
    return (
      <PropertyEditorComponent
        ref={this.#formRef}
        editorName={this.editorName}
        values={this.values}
        advancedMode={this.advancedMode}
        dataList={this.dataList}
        handleValuesChange={this.#handleValuesChange}
        onSubmitEffect={this.#onSubmitEffect}
      />
    );
  }
}

export interface PropertyEditorProps {
  values: any;
  editorName: string;
  advancedMode?: boolean;
  dataList: DataItem[];
  handleValuesChange: (value: any) => void;
  onSubmitEffect: (listener: (form: Form) => any) => void;
}

export function LegacyPropertyEditor(
  {
    advancedMode,
    values,
    editorName,
    dataList,
    handleValuesChange,
    onSubmitEffect,
  }: PropertyEditorProps,
  ref: any
) {
  const currentTheme = useCurrentTheme();
  const cache = useMemo(() => createCache(), []);
  const form = useMemo(() => createForm(), []);
  const [Editor, setEditor] = useState<
    (props: EditorComponentProps) => React.ReactElement
  >(() => customEditors.get(editorName) as any);

  useImperativeHandle(ref, () => ({
    getFormInstance: () => form,
  }));

  const load = useCallback(async () => {
    // TODO: cache editors
    await __secret_internals.loadEditors([editorName]);
    setEditor(() => customEditors.get(editorName)(React) as any);
  }, [editorName]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (Editor) form.setInitialValues(values);
  }, [Editor]);

  useEffect(() => {
    const { values } = form.getState();
    if (advancedMode) {
      form.setInitialValues({
        [ADVANCED_FORM_KEY]: _.isEmpty(values)
          ? ""
          : yaml.safeDump(_.omit(values, [ADVANCED_FORM_KEY])),
      });
    } else {
      const realValue = values[ADVANCED_FORM_KEY];
      if (realValue) {
        form.setInitialValues(yaml.safeLoad(realValue));
      } else {
        form.setInitialValues(values);
      }
    }
  }, [advancedMode, form]);

  useEffect(() => {
    form.addEffects("onValueChange", () => {
      onFormValuesChange((form) => {
        handleValuesChange(form.values);
      });
    });
  }, []);

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
              scope={{
                dataList,
                advancedMode,
              }}
              effects={{
                onFieldInit,
                onFieldValueChange,
                onFieldInitialValueChange,
                onFormInitialValuesChange,
                onFormValidateSuccess,
                onSubmit: onSubmitEffect,
              }}
              formilySchemaFormatter={formilySchemaFormatter}
            />
          </FormProvider>
        </StyleProvider>
      </ConfigProvider>
    </div>
  );
}
