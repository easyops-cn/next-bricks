import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { AbstractForm, FormStore, MessageBody } from "@next-shared/form";
import { ComponentSize, Layout } from "../interface.js";

const { defineElement, property, event, method } = createDecorators();

interface FormProps {
  values?: Record<string, any>;
  layout?: Layout;
  size?: ComponentSize;
}

export interface FormEvents {
  valuesChange?: Event;
  validateSuccess?: Event;
  validateError?: Event;
}

export interface FormMapEvents {
  onValuesChange: "values.change";
  onValidateSuccess: "validate.success";
  onValidateError: "validate.error";
}

/**
 * 表单构件
 * @author sailor
 * @slot - 表单内容
 */
@defineElement("form.general-form", {
  styleTexts: [],
})
class Form extends ReactNextElement implements FormProps, AbstractForm {
  formStore: FormStore;
  #_values!: Record<string, unknown>;
  defaultEmitValuesChange = true;

  constructor() {
    super();
    this.formStore = FormStore.getInstance({
      onValuesChanged: this.handleValuesChange,
    });
  }

  get isFormElement(): true {
    return true;
  }

  set values(value: Record<string, unknown>) {
    this.#_values = value;

    this.#_setInitValue(value);
  }
  get values(): Record<string, unknown> {
    return this.#_values;
  }

  #_setInitValue(values: Record<string, unknown>) {
    this.formStore.setInitValue(values, this.defaultEmitValuesChange);
  }

  /**
   * 布局方式
   */
  @property() accessor layout: Layout | undefined;

  /**
   * 表单组件尺寸
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 表单值变更事件
   * @detail
   */
  @event({ type: "values.change" }) accessor #valuesChangeEvent!: EventEmitter<
    Record<string, unknown>
  >;
  handleValuesChange = (values: Record<string, unknown>) => {
    this.#valuesChangeEvent.emit(values);
  };

  /**
   * 表单验证成功时触发事件
   */
  @event({ type: "validate.success" }) accessor #successEvent!: EventEmitter<
    Record<string, unknown>
  >;
  /**
   * 表单验证报错时触发事件
   */
  @event({ type: "validate.error" }) accessor #errorEvent!: EventEmitter<
    MessageBody[]
  >;

  /**
   * 表单校验方法
   */
  @method()
  validate(): boolean | Record<string, unknown> {
    return this.formStore.validateFields((err, values) => {
      if (err) {
        this.#errorEvent.emit(values);
      } else {
        this.#successEvent.emit(values);
      }
    });
  }

  /**
   * 表单设置值方法
   */
  @method()
  setInitValue(values: Record<string, unknown>) {
    this.#_setInitValue(values);
  }

  /**
   * 表单重置值方法
   */
  @method()
  resetFields(name?: string) {
    this.formStore.resetFields(typeof name === "string" ? name : undefined);
  }

  /**
   * 获取表单值方法
   */
  @method()
  getFieldsValue(name?: string) {
    return this.formStore.getFieldsValue(
      typeof name === "string" ? name : undefined
    );
  }

  /**
   * 校验表单字段方法
   */
  @method()
  validateField(name: string) {
    this.formStore.validateField(name);
  }

  /**
   * 重置表单校验状态方法
   */
  @method()
  resetValidateState() {
    this.formStore.resetValidateState();
  }

  render() {
    return <FormComponent layout={this.layout} size={this.size} />;
  }
}

interface FormComponentProps extends FormProps {
  onValuesChange?: (value: Record<string, any>) => void;
  onValidateSuccess?: () => void;
  onValidateError?: () => void;
}

export function FormComponent({ layout = "horizontal" }: FormComponentProps) {
  return (
    <form>
      <slot
        style={{
          display: layout === "inline" ? "flex" : "",
          gap: layout === "inline" ? "10px" : "",
        }}
      />
    </form>
  );
}

export { Form, FormProps };
