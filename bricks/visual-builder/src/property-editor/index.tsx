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
import { createSchemaField, FormProvider } from "@formily/react";
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
import {
  EditorComponentProps,
  DataItem,
  SelectOptions,
} from "@next-shared/property-editor";
import { CategoryTitle } from "./components/CategoryTitle";
import { AdvancedFormItem } from "./components/AdvancedFormItem";
import { CodeEditorComponent } from "./components/common/CodeEditorComponent";
import { IconSelectComponent } from "./components/common/IconSelectComponent";
import { ColorPickerComponent } from "./components/common/ColorPickerComponent";
import { InputWithUrlComponent } from "./components/common/InputWithUrlComponent";
import { TextAlignRadioComponent } from "./components/common/TextAlignRadioComponent";
import { InputWithUnitComponent } from "./components/common/InputWithUnitComponent";
import { UseChildrenSelectComponent } from "./components/common/UseChildrenSelectComponent";
import { BoxSizeComponent } from "./components/common/BoxSizeComponent";
import { CustomOptionsComponent } from "./components/common/CustomOptionsComponent";
import { CustomTab } from "./components/common/CustomTab";
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

export const SchemaField = createSchemaField({
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
    UseChildrenSelect: UseChildrenSelectComponent,
    InputWithUrl: InputWithUrlComponent,
    InputWithUnit: InputWithUnitComponent,
    TextAlignRadio: TextAlignRadioComponent,
    CustomOptions: CustomOptionsComponent,
    BoxSize: BoxSizeComponent,
    CustomTab,
  },
});

export type { DataNode };

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
  accessor extraLibs: SelectOptions;

  @property({
    attribute: false,
  })
  accessor childSlots: SelectOptions;

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
        // transformStyle(this.#submitValue || getRealValue(), this.advancedMode);
        this.#successEvent.emit(this.#submitValue ?? getRealValue());
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

  @event({ type: "trigger.action" })
  accessor #triggerActionEvent!: EventEmitter<string>;

  #handleTriggerAction = (action: string) => {
    this.#triggerActionEvent.emit(action);
  };

  render() {
    return (
      <PropertyEditorComponent
        ref={this.#formRef}
        editorName={this.editorName}
        values={this.values === "undefined" ? undefined : this.values}
        advancedMode={this.advancedMode}
        dataList={this.dataList}
        extraLibs={this.extraLibs}
        links={this.links}
        childSlots={this.childSlots}
        editorPackages={this.editorPackages}
        handleValuesChange={this.#handleValuesChange}
        handleTokenClick={this.#handleTokenClick}
        handleTriggerAction={this.#handleTriggerAction}
        onSubmitEffect={this.#onSubmitEffect}
      />
    );
  }
}

export interface PropertyEditorProps {
  values: any;
  editorName: string;
  advancedMode?: boolean;
  childSlots?: SelectOptions;
  extraLibs: SelectOptions;
  dataList: DataItem[];
  links: any;
  editorPackages: BrickPackage[];
  handleValuesChange: (value: any) => void;
  handleTokenClick: (token: string) => void;
  handleTriggerAction: (action: string) => void;
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
    childSlots,
    links,
    handleValuesChange,
    handleTokenClick,
    handleTriggerAction,
    onSubmitEffect,
  }: PropertyEditorProps,
  ref: any
) {
  const [Editor, setEditor] = useState<
    (props: EditorComponentProps<typeof SchemaField>) => React.ReactElement
  >(() => customEditors.get(editorName)?.(React) as any);
  const currentTheme = useCurrentTheme();
  const cache = useMemo(() => createCache(), []);
  // should update form instance when Editor change
  const form = useMemo(() => createForm(), [Editor]);
  const transformValueRef = useRef<any>(null);
  const advancedChangeRef = useRef<boolean>(false);

  const onAdvancedChangeEffect = useMemo(
    () =>
      createEffectHook(
        ADVANCED_CHANGE_KEY,
        (advancedMode, form) => (listener) => {
          const values =
            !advancedMode && form.values[ADVANCED_FORM_KEY]
              ? form.values[ADVANCED_FORM_KEY]
              : form.values;
          transformValueRef.current = listener(advancedMode, form, values);
        }
      ),
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
      form.setInitialValues(values, "overwrite");
    }
  }, [Editor, form]);

  useEffect(() => {
    advancedChangeRef.current = true;
    transformValueRef.current = null;

    form.notify(ADVANCED_CHANGE_KEY, advancedMode);

    form.query(NORMAL_FORM_KEY).take((field) => {
      field.display = !advancedMode ? "visible" : "hidden";
    });
    form.query(ADVANCED_FORM_KEY).take((field) => {
      field.display = advancedMode ? "visible" : "hidden";
    });

    const formValues = form.getState().values;
    const formData = defaultTransform(
      transformValueRef.current ?? formValues,
      advancedMode
    );

    form.setValues(formData, "overwrite");
    advancedChangeRef.current = false;
  }, [advancedMode, form, defaultTransform, Editor]);

  useEffect(() => {
    form.addEffects("onValueChange", () => {
      onFormValuesChange((form) => {
        if (advancedChangeRef.current) return;
        handleValuesChange(form.values);
      });
    });
  }, [form, handleValuesChange]);

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
                childSlots,
                extraLibs,
                links,
                tokenClick: (event: CustomEvent<string>) =>
                  handleTokenClick(event.detail),
                triggerAction: handleTriggerAction,
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
