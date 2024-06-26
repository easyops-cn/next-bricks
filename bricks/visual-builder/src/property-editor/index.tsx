import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  createRef,
  useState,
  useCallback,
  useRef,
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
import { ColorPickerComponent } from "./components/common/ColorPickerComponent";
import { InputWithUrlComponent } from "./components/common/InputWithUrlComponent";
import { TextAlignRadioComponent } from "./components/common/TextAlignRadioComponent";
import { __secret_internals, customEditors } from "@next-core/runtime";
import {
  ADVANCED_FORM_KEY,
  DataNode,
  formilySchemaFormatter,
} from "./utils/formilySchemaFormatter";
import "./style.css";
import _ from "lodash";
import { BrickPackage } from "@next-core/types";
import { NORMAL_FORM_KEY } from "./utils/formilySchemaFormatter";

const { defineElement, property, method, event } = createDecorators();

const PropertyEditorComponent = React.forwardRef(LegacyPropertyEditor);

export const BEFORE_SUBMIT_KEY = "before_submit";
export const ADVANCED_CHANGE_KEY = "on_advanced_change";

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
    ColorPicker: ColorPickerComponent,
    InputWithUrl: InputWithUrlComponent,
    TextAlignRadio: TextAlignRadioComponent,
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
    onSubmit: (listener: (value: any, form: Form) => any) => void;
    onAdvancedChange: (
      listener: (advancedMode: boolean, form: Form) => any
    ) => void;
    // support any effects
  };
  scope: {
    advancedMode: boolean;
    dataList: DataItem[];
    extraLibs: any;
    links: any;
    tokenClick: (token: CustomEvent<string>) => void;
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

  @property({
    attribute: false,
  })
  accessor editorPackages: BrickPackage[];

  @property({
    attribute: false,
  })
  accessor links: any;

  @property({
    attribute: false,
  })
  accessor extraLibs: any;

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
    const getRealValue = () => {
      return this.advancedMode
        ? form.values[ADVANCED_FORM_KEY]
        : _.omit(form.values, [ADVANCED_FORM_KEY]);
    };

    form
      .validate()
      .then(() => {
        form.notify(BEFORE_SUBMIT_KEY, getRealValue());
        if (this.#submitValue) {
          this.#successEvent.emit(this.#submitValue);
        } else {
          this.#successEvent.emit(getRealValue());
        }
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

  @event({ type: "token.click" })
  accessor #tokenClick!: EventEmitter<string>;

  #handleTokenClick = (value: string): void => {
    this.#tokenClick.emit(value);
  };

  #submitValue: any;

  #onSubmitEffect = createEffectHook(
    BEFORE_SUBMIT_KEY,
    (values, form) => (listener) => {
      this.#submitValue = listener(values, form);
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
        extraLibs={this.extraLibs}
        links={this.links}
        editorPackages={this.editorPackages}
        handleValuesChange={this.#handleValuesChange}
        handleTokenClick={this.#handleTokenClick}
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
  extraLibs: any;
  links: any;
  editorPackages: BrickPackage[];
  handleValuesChange: (value: any) => void;
  handleTokenClick: (token: string) => void;
  onSubmitEffect: (listener: (value: any, form: Form) => any) => void;
}

export function LegacyPropertyEditor(
  {
    advancedMode,
    values,
    editorName,
    dataList,
    editorPackages,
    extraLibs,
    links,
    handleValuesChange,
    handleTokenClick,
    onSubmitEffect,
  }: PropertyEditorProps,
  ref: any
) {
  const [Editor, setEditor] = useState<
    (props: EditorComponentProps) => React.ReactElement
  >(() => customEditors.get(editorName)?.(React) as any);
  const currentTheme = useCurrentTheme();
  const cache = useMemo(() => createCache(), []);
  // should update form instance when Editor change
  const form = useMemo(() => createForm(), [Editor]);
  const transformValueRef = useRef<any>(null);

  const onAdvancedChangeEffect = useMemo(
    () =>
      createEffectHook(ADVANCED_CHANGE_KEY, (options, form) => (listener) => {
        transformValueRef.current = listener(options, form);
      }),
    []
  );

  useImperativeHandle(ref, () => ({
    getFormInstance: () => form,
  }));

  const load = useCallback(async () => {
    // TODO: cache editors
    if (customEditors.get(editorName)) {
      setEditor(() => customEditors.get(editorName)?.(React) as any);
      return;
    }
    await __secret_internals.loadEditors([editorName], editorPackages);
    setEditor(() => customEditors.get(editorName)?.(React) as any);
  }, [editorName, editorPackages]);

  const defaultTransform = useCallback((values: any, advancedMode: boolean) => {
    if (advancedMode) {
      const filterValue = _.omit(values, [ADVANCED_FORM_KEY]);
      return {
        [ADVANCED_FORM_KEY]: _.isEmpty(filterValue) ? "" : filterValue,
      };
    }
    return values[ADVANCED_FORM_KEY] ?? values;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (Editor) {
      form.setInitialValues(values);
    }
  }, [Editor, form]);

  useEffect(() => {
    transformValueRef.current = null;

    form.notify(ADVANCED_CHANGE_KEY, advancedMode);

    form.query(NORMAL_FORM_KEY).take((field) => {
      field.display = !advancedMode ? "visible" : "hidden";
    });
    form.query(ADVANCED_FORM_KEY).take((field) => {
      field.display = advancedMode ? "visible" : "hidden";
    });

    const { values } = form.getState();
    const formData = defaultTransform(
      transformValueRef.current ?? values,
      advancedMode
    );
    form.setValues(formData, "overwrite");
  }, [advancedMode, form, defaultTransform, Editor]);

  useEffect(() => {
    form.addEffects("onValueChange", () => {
      onFormValuesChange((form) => {
        handleValuesChange(form.values);
      });
    });
  }, [form]);

  if (!Editor) return null;

  return (
    <div className="property-form-wrapper">
      <ConfigProvider
        prefixCls="antdV5"
        theme={{
          algorithm:
            currentTheme === "dark-v2"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          components: {
            // Form: {
            //   not work
            //   itemMarginBottom: 10,
            // }
            InputNumber: {
              handleVisible: true,
            },
          },
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
                extraLibs,
                links,
                tokenClick: (event: CustomEvent<string>) =>
                  handleTokenClick(event.detail),
              }}
              effects={{
                onFieldInit,
                onFieldValueChange,
                onFieldInitialValueChange,
                onFormInitialValuesChange,
                onFormValidateSuccess,
                onSubmit: onSubmitEffect,
                onAdvancedChange: onAdvancedChangeEffect,
              }}
              formilySchemaFormatter={formilySchemaFormatter}
            />
          </FormProvider>
        </StyleProvider>
      </ConfigProvider>
    </div>
  );
}
