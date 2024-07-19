import React, { useMemo } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import {
  AbstractForm,
  FormStore,
  MessageBody,
  ColProps,
} from "@next-shared/form";
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
 * @category form-input-basic
 */
@defineElement("eo-form", {
  alias: ["form.general-form"],
})
class Form extends ReactNextElement implements FormProps, AbstractForm {
  formStore: FormStore;
  #values!: Record<string, unknown>;
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
    this.#values = value;

    this.#setInitValue(value);
  }
  get values(): Record<string, unknown> {
    return this.#values;
  }

  #setInitValue(values: Record<string, unknown>) {
    this.formStore.setInitValue(values, this.defaultEmitValuesChange);
  }

  /**
   * 布局方式(默认 vertical 布局)
   * @default vertical
   */
  @property() accessor layout: Layout = "vertical";

  /**
   * 表单组件尺寸
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 标签列布局样式（仅当 layout="horizontal" 时有效）
   */
  @property({
    attribute: false,
  })
  accessor labelCol: ColProps = {
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
    lg: {
      span: 7,
    },
    xl: {
      span: 5,
    },
    xxl: {
      span: 4,
    },
  };

  /**
   * 输入控件列布局样式（仅当 layout="horizontal" 时有效）
   */
  @property({
    attribute: false,
  })
  accessor wrapperCol: ColProps = {
    sm: {
      span: 18,
    },
    md: {
      span: 18,
    },
    lg: {
      span: 13,
    },
    xl: {
      span: 16,
    },
    xxl: {
      span: 18,
    },
  };

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
    (MessageBody & { name: string })[]
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
  setInitValue(
    values: Record<string, unknown>,
    options?: { runInMacrotask?: boolean; runInMicrotask?: boolean }
  ) {
    if (options) {
      options.runInMicrotask &&
        queueMicrotask(() => {
          this.values = values;
        });
      options.runInMacrotask &&
        setTimeout(() => {
          this.values = values;
        });
    } else {
      this.values = values;
    }
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

  @property({
    attribute: false,
  })
  accessor formStyle: React.CSSProperties | undefined;

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
    return (
      <FormComponent
        layout={this.layout}
        size={this.size}
        labelCol={this.labelCol}
        wrapperCol={this.wrapperCol}
        formStyle={this.formStyle}
      />
    );
  }
}

interface FormComponentProps extends FormProps {
  formStyle?: React.CSSProperties;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  onValuesChange?: (value: Record<string, any>) => void;
  onValidateSuccess?: () => void;
  onValidateError?: () => void;
}

export function FormComponent({
  layout = "vertical",
  formStyle,
}: FormComponentProps) {
  const computedStyle = useMemo((): React.CSSProperties => {
    switch (layout) {
      case "vertical":
      case "horizontal": {
        return {
          display: "flex",
          flexDirection: "column",
        };
      }
      case "inline": {
        return {
          display: "flex",
          gap: 10,
        };
      }
      default:
        return {};
    }
  }, [layout]);

  return (
    <form>
      <slot
        style={{
          ...computedStyle,
          ...(formStyle ? formStyle : {}),
        }}
      />
    </form>
  );
}

export { Form, FormProps };
