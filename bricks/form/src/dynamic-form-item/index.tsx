import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type {
  Form,
  FormEvents,
  FormMapEvents,
  FormProps,
} from "../form/index.js";
import type { FormItem, FormItemProps } from "../form-item/index.jsx";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import { UseBrickConf } from "@next-core/types";
import styleText from "./dynamic-form-item.shadow.css";
import "@next-core/theme";
import { isEqual } from "lodash";
import { FormItemElementBase } from "@next-shared/form";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

const WrappedButton = wrapBrick<Button, ButtonProps>("basic.general-button");

const WrappedForm = wrapBrick<Form, FormProps, FormEvents, FormMapEvents>(
  "form.general-form",
  {
    onValuesChange: "values.change",
    onValidateSuccess: "validate.success",
    onValidateError: "validate.error",
  }
);

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

type DynamicFormValuesItem = Record<string, any>;

interface DynamicFormItemProps extends FormItemProps {
  form?: Form;
  useBrick?: UseBrickConf;
  value?: DynamicFormValuesItem[];
  validateState?: string;
  needValidate?: boolean;
  onChange?: (value: DynamicFormValuesItem[]) => void;
  onValuesChange?: (values: DynamicFormValuesItem[]) => void;
}

/**
 * @id form.dynamic-form-item
 * @name form.dynamic-form-item
 * @docKind brick
 * @description 动态表单
 * @author sailor
 * @noInheritDoc
 */
@defineElement("form.dynamic-form-item", {
  styleTexts: [styleText],
})
class DynamicFormItem extends FormItemElementBase {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;
  /**
   * 字段说明
   */
  @property() accessor label: string | undefined;
  /**
   * 是否必填
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * 值
   */
  @property({
    attribute: false,
  })
  accessor value: DynamicFormValuesItem[] | undefined;

  /**
   * 动态表单子项构件列表
   */
  @property({
    attribute: false,
  })
  accessor useBrick: UseBrickConf | undefined;

  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<DynamicFormValuesItem[]>;

  handleDynamicFormChange = (values: DynamicFormValuesItem[]) => {
    this.value = values;
    this.#changeEvent.emit(values);
    this.getFormElement()?.resetValidateState();
  };

  render() {
    return (
      <DynamicFormItemComponent
        formElement={this.getFormElement()}
        curElement={this}
        name={this.name}
        label={this.label}
        required={this.required}
        useBrick={this.useBrick}
        value={this.value}
        validateState={this.validateState}
        needValidate={false}
        trigger="handleDynamicFormChange"
        onChange={this.handleDynamicFormChange}
        onValuesChange={this.handleDynamicFormChange}
      />
    );
  }
}

function DynamicFormItemComponent(props: DynamicFormItemProps) {
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<DynamicFormValuesItem[]>(
    props.value ?? []
  );

  const handleAddItem = () => {
    setValues(values.concat({}));
  };

  useEffect(() => {
    if (!isEqual(props.value, values)) {
      setValues(props.value ?? []);
    }
  }, [props.value]);

  const validate = () => {
    const formWrapper = formWrapperRef.current;
    const forms = formWrapper?.querySelectorAll(
      ".dynamic-form"
    ) as unknown as Form[];
    const result: Array<boolean | Record<string, unknown>> = [];
    if (forms.length) {
      forms.forEach((item) => {
        result.push(item.validate());
      });
    }
    return result.every(Boolean) ? "" : "动态表单校验失败";
  };

  const handleValuesChange = useCallback(
    (value: CustomEvent<DynamicFormValuesItem>, index: number) => {
      props.onChange?.(
        values.map((item, i) => {
          if (i === index) {
            return value.detail.allValues;
          }
          return item;
        })
      );
    },
    [props, values]
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      const newValues = values.filter((_, i) => i !== index);
      setValues(newValues);
      props.onChange?.(newValues);
    },
    [props, values]
  );

  return (
    <WrappedFormItem {...(props as FormItemProps)} validator={validate}>
      <div className="dynamic-form-wrapper" ref={formWrapperRef}>
        {values.map((value, index) => {
          return (
            <div className="dynamic-form-item" key={index}>
              {props.useBrick && (
                <WrappedForm
                  layout="inline"
                  className="dynamic-form"
                  values={value}
                  defaultEmitValuesChange={false}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onValuesChange={(value) => handleValuesChange(value, index)}
                >
                  <ReactUseMultipleBricks
                    useBrick={props.useBrick}
                    data={value}
                  />
                  <WrappedIcon
                    lib="easyops"
                    category="assets-inventory"
                    icon="out"
                    className="remove-btn"
                    onClick={() => handleRemoveItem(index)}
                  />
                </WrappedForm>
              )}
            </div>
          );
        })}
        <WrappedButton
          className="add-btn"
          icon={{
            category: "assets-inventory",
            icon: "xin",
            lib: "easyops",
          }}
          type="dashed"
          buttonStyle={{
            width: "100%",
          }}
          onClick={handleAddItem}
        >
          添加
        </WrappedButton>
      </div>
      <slot name="helpSlot"></slot>
    </WrappedFormItem>
  );
}

export { DynamicFormItem };
