import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { FormStore, MessageBody } from "./formStore.js";
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
 * @id basic.general-form
 * @name basic.general-form
 * @docKind brick
 * @description 通用输入框构件
 * @author sailor
 * @noInheritDoc
 */
@defineElement("basic.general-form", {
  styleTexts: [],
})
class Form extends ReactNextElement implements FormProps {
  readonly isFormElement = true;
  formStore: FormStore;
  #_values!: Record<string, unknown>;
  defaultEmitValuesChange = true;

  constructor() {
    super();
    this.formStore = FormStore.getInstance({
      onValuesChanged: this.handleValuesChange,
    });
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

  @property() accessor layout: Layout | undefined;

  @property() accessor size: ComponentSize | undefined;

  /**
   * @detail
   * @description
   */
  @event({ type: "values.change" }) accessor #valuesChangeEvent!: EventEmitter<
    Record<string, unknown>
  >;
  handleValuesChange = (values: Record<string, unknown>) => {
    this.#valuesChangeEvent.emit(values);
  };

  /**
   * @description 表单验证成功时触发
   */
  @event({ type: "validate.success" }) accessor #successEvent!: EventEmitter<
    Record<string, unknown>
  >;
  /**
   * @description 表单验证报错时触发
   */
  @event({ type: "validate.error" }) accessor #errorEvent!: EventEmitter<
    MessageBody[]
  >;

  /**
   * @description
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
   * @description
   */
  @method()
  setInitValue(values: Record<string, unknown>) {
    this.#_setInitValue(values);
  }

  /**
   * @description
   */
  @method()
  resetFields(name?: string) {
    this.formStore.resetFields(name);
  }

  /**
   * @description
   */
  @method()
  getFieldsValue(name: string) {
    return this.formStore.getFieldsValue(name);
  }

  /**
   * @description
   */
  @method()
  validateField(name: string) {
    this.formStore.validateField(name);
  }

  /**
   * @description
   */
  @method()
  resetValidateState() {
    this.formStore.resetValidateState()
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

export function FormComponent({
  layout = "horizontal"
}: FormComponentProps) {
  return (
    <form>
      <slot style={{
        display: layout === "inline" ? "flex" : "",
      }} />
    </form>
  );
}

export { Form, FormProps };
