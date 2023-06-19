import React, { useState, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import {
  AbstractForm,
  FormItemElementBase,
  MessageBody,
} from "@next-shared/form";
import type { Form } from "../form/index.jsx";
import styleText from "./FormItem.shadow.css";
import classNames from "classnames";
import type { ComponentSize, Layout } from "../interface.js";
import "@next-core/theme";

type CurrentElement = HTMLElement & {
  size?: ComponentSize;
  validateState?: MessageBody | string;
  [key: string]: any;
};

export interface FormItemProps {
  formElement?: AbstractForm | null;
  curElement: CurrentElement;
  name?: string;
  label?: string;
  current?: HTMLElement;
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  labelCol?: string;
  wrapperCol?: string;
  message?: Record<string, string>;
  layout?: Layout;
  size?: ComponentSize;
  trigger?: string;
  valuePropsName?: string;
  needValidate?: boolean;
  validator?: (value: any) => MessageBody | string;
}

const { defineElement, property } = createDecorators();

/**
 * @id form.general-form
 * @name form.general-form
 * @docKind brick
 * @description 通用输入框构件
 * @author sailor
 * @noInheritDoc
 */
@defineElement("form.general-form-item", {
  styleTexts: [styleText],
})
class FormItem extends FormItemElementBase implements FormItemProps {
  /**
   * @default
   * @required
   * @description
   */
  @property({
    attribute: false,
  })
  accessor formElement: Form | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    attribute: false,
  })
  accessor curElement!: HTMLElement;

  /**
   * @kind string
   * @required false
   * @default default
   * @description 字段名称
   * @enums
   * @group basic
   */
  @property() accessor name: string | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property() accessor label: string | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property() accessor pattern: string | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    attribute: false,
  })
  accessor message: Record<string, string> | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    type: Number,
  })
  accessor max: number | undefined;

  /**
   * @default
   * @required
   * @description
   */
  @property({
    type: Number,
  })
  accessor min: number | undefined;

  /**
   * @kind boolean
   * @required false
   * @default -
   * @description 表单项是否必填
   * @group basicFormItem
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * @kind string
   * @required false
   * @default default
   * @description 初始值
   * @enums
   * @group basic
   */
  @property() accessor value: string | undefined;

  /**
   * @required false
   * @description 表单项 label 标签布局
   * @group ui
   */
  @property()
  accessor labelCol: string | undefined;

  /**
   * @required false
   * @description 表单项控件布局
   * @group ui
   */
  @property()
  accessor wrapperCol: string | undefined;

  /**
   * @kind string
   * @required false
   * @default default
   * @description 初始值
   * @enums
   * @group basic
   */
  @property() accessor valuePropsName: string | undefined;

  @property() accessor layout: Layout = "horizontal";

  /**
   * @kind string
   * @required false
   * @default default
   * @description 初始值
   * @enums
   * @group basic
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * @default true
   * @description 是否自动去除前后的空白字符
   * @group advancedFormItem
   */
  @property({
    type: Boolean,
  })
  accessor trim = true;

  /**
   * @default false
   * @description 事件触发方法名
   */
  @property()
  accessor trigger!: string;

  /**
   * @default false
   * @description 表单项校验方法
   */
  @property({
    attribute: false,
  })
  accessor validator: ((value: any) => MessageBody) | undefined;

  /**
   * @default
   * @required
   * @description 值变化时是否主动出发校验
   */
  @property({
    type: Boolean,
  })
  accessor needValidate: boolean | undefined;

  render() {
    return (
      <FormItemComponent
        formElement={this.formElement}
        curElement={this.curElement}
        label={this.label}
        name={this.name}
        required={this.required}
        pattern={this.pattern}
        min={this.min}
        max={this.max}
        message={this.message}
        size={this.size || this.formElement?.size}
        layout={this.layout || this.formElement?.layout}
        trigger={this.trigger}
        valuePropsName={this.valuePropsName}
        needValidate={this.needValidate}
        validator={this.validator}
      />
    );
  }
}

export { FormItem };

export function FormItemComponent(props: FormItemProps) {
  const {
    name,
    label,
    required,
    pattern,
    max,
    min,
    message,
    formElement,
    curElement,
    valuePropsName = "value",
    size,
    trigger = "onChange",
    layout,
    needValidate = true,
    validator,
  } = props;
  const formInstance = formElement?.formStore;

  const defaultValidateState = useRef<MessageBody>({
    message: "",
    type: "normal",
  });
  const [validateState, setValidateState] = useState<MessageBody>(
    defaultValidateState.current
  );

  useEffect(() => {
    if (!formInstance || !name || curElement.$bindFormItem) return;
    const originTrigger = curElement[trigger];
    curElement[trigger] = (e: React.ChangeEvent) =>
      formInstance.onWatch(name, e, originTrigger, {
        needValidate,
      });
    curElement.$bindFormItem = true;

    formInstance.subscribe(`${name}.validate`, (_, detail) => {
      setValidateState(detail);
      curElement.validateState = detail.type;
    });
    formInstance.subscribe(`${name}.init.value`, (_, v) => {
      curElement[valuePropsName] = v;
      curElement.validateState = "";
      setValidateState({
        message: "",
        type: "normal",
      });
    });
    formInstance.subscribe(`${name}.reset.fields`, () => {
      curElement[valuePropsName] = undefined;
    });
    formInstance.subscribe("reset.fields", () => {
      curElement[valuePropsName] = undefined;
    });
    formInstance.subscribe("reset.validate", () => {
      setValidateState(defaultValidateState.current);
      curElement.validateState = defaultValidateState.current.type;
    });

    return () => {
      formInstance.unsubscribe(`${name}.validate`);
      formInstance.unsubscribe(`${name}.init.value`);
      formInstance.unsubscribe(`${name}.reset.fields`);
      formInstance.unsubscribe("reset.fields");
    };
  }, [curElement, formInstance, name, trigger, valuePropsName, needValidate]);

  useEffect(() => {
    if (!formInstance || !name) return;
    formInstance.setField(name, {
      name,
      label,
      validate: {
        required,
        pattern,
        max,
        min,
        message,
        validator,
      },
    });

    if (layout === "inline") curElement.style.display = "inline-block";
    if (size) {
      curElement.size = formElement.size || size;
    }
    formInstance.setFieldsValueByInitData(name);
  }, [
    curElement,
    formElement,
    formInstance,
    label,
    layout,
    max,
    message,
    min,
    name,
    pattern,
    required,
    size,
    validator,
  ]);

  return (
    <div className={classNames("form-item", layout)}>
      {label && (
        <div className="form-item-label">
          <label>
            {required && <span className="required">*</span>}
            {label}
          </label>
        </div>
      )}
      <div className="form-item-wrapper">
        <div className="form-item-control">
          <slot></slot>
        </div>
        {formElement ? (
          <div
            className={classNames("message", {
              error: validateState.type === "error",
            })}
          >
            {validateState?.type !== "normal" && validateState.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
