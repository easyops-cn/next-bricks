import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { UseBrickConf, UseSingleBrickConf } from "@next-core/types";
import styleText from "./dynamic-form-item.shadow.css";
import "@next-core/theme";
import { isEqual, flatten, omit, isEmpty } from "lodash";
import { FormItemElementBase } from "@next-shared/form";
import { K, NS, locales } from "./i18n.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import classNames from "classnames";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");

const WrappedForm = wrapBrick<Form, FormProps, FormEvents, FormMapEvents>(
  "eo-form",
  {
    onValuesChange: "values.change",
    onValidateSuccess: "validate.success",
    onValidateError: "validate.error",
  }
);

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

export function uniqueValidatorFN(
  props: DynamicFormItemProps,
  properties: any,
  t: any
) {
  return () => {
    const fieldValue = props?.curElement?.value?.map(
      (v: any) => v[properties.name as string]
    );
    if (new Set(fieldValue).size !== fieldValue.length) {
      return (
        (properties.message as any)?.unique ??
        t(K.UNIQUE, { name: properties.label ?? properties.name })
      );
    }
    return "";
  };
}

type DynamicFormValuesItem = Record<string, any>;

interface DynamicFormItemProps extends FormItemProps {
  form?: Form;
  useBrick?: UseBrickConf;
  value?: DynamicFormValuesItem[];
  validateState?: string;
  needValidate?: boolean;
  onChange?: (value: DynamicFormValuesItem[]) => void;
  onValuesChange?: (values: DynamicFormValuesItem[]) => void;
  onAdd?: (value: rowDataType) => void;
  onRemove?: (value: rowDataType) => void;
  hideRemoveButton?:
    | boolean
    | ((row: Record<string, any>, index: number) => boolean);
  disabledRemoveButton?:
    | boolean
    | ((row: Record<string, any>, index: number) => boolean);
  hideAddButton?: boolean | ((value: Record<string, any>[]) => boolean);
  disabledAddButton?: boolean | ((value: Record<string, any>[]) => boolean);
}
type rowDataType = {
  detail: Record<string, any>;
  index: number;
};

export const getRealValue = (
  property: boolean | ((...args: any[]) => boolean),
  args: any[]
): boolean => {
  if (typeof property === "function") {
    return property(...args);
  }
  return property;
};
/**
 * 动态表单
 * @author sailor
 * @category form-input-basic
 */
@defineElement("eo-dynamic-form-item", {
  styleTexts: [styleText],
  alias: ["form.dynamic-form-item"],
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
   * 校验文本
   */
  @property({ attribute: false })
  accessor message: Record<string, string> | undefined;

  /**
   * 是否隐藏每一行删除的按钮
   */
  @property({
    attribute: false,
  })
  accessor hideRemoveButton:
    | boolean
    | ((row: Record<string, any>, index: number) => boolean)
    | undefined;

  /**
   * 是否禁止每一行删除的按钮
   */
  @property({
    attribute: false,
  })
  accessor disabledRemoveButton:
    | boolean
    | ((row: Record<string, any>, index: number) => boolean)
    | undefined;

  /**
   * 是否隐藏添加的按钮
   */
  @property({
    attribute: false,
  })
  accessor hideAddButton:
    | boolean
    | ((value: Record<string, any>[]) => boolean)
    | undefined;

  /**
   * 是否禁止添加的按钮
   */
  @property({
    attribute: false,
  })
  accessor disabledAddButton:
    | boolean
    | ((value: Record<string, any>[]) => boolean)
    | undefined;

  /**
   * 动态表单子项构件列表
   */
  @property({
    attribute: false,
  })
  accessor useBrick: UseBrickConf | undefined;

  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<DynamicFormValuesItem[]>;

  /**
   * 增加一行时触发，detail为该行的默认值，index为该行的位置
   */
  @event({ type: "row.add" })
  accessor #addEvent!: EventEmitter<rowDataType>;

  /**
   * 移除一行时触发，detail为该行的值，index为该行的位置
   */
  @event({ type: "row.remove" })
  accessor #removeEvent!: EventEmitter<rowDataType>;

  #handleAdd = (value: rowDataType): void => {
    this.#addEvent.emit(value);
  };

  #handleRemove = (value: rowDataType): void => {
    this.#removeEvent.emit(value);
  };

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
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        trigger="handleDynamicFormChange"
        onChange={this.handleDynamicFormChange}
        onValuesChange={this.handleDynamicFormChange}
        message={this.message}
        onAdd={this.#handleAdd}
        onRemove={this.#handleRemove}
        hideAddButton={this.hideAddButton}
        hideRemoveButton={this.hideRemoveButton}
        disabledAddButton={this.disabledAddButton}
        disabledRemoveButton={this.disabledRemoveButton}
      />
    );
  }
}

export function DynamicFormItemComponent(props: DynamicFormItemProps) {
  const { t } = useTranslation(NS);
  const {
    value,
    hideAddButton = false,
    hideRemoveButton = false,
    disabledRemoveButton = false,
    disabledAddButton = false,
  } = props;
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<DynamicFormValuesItem[]>(value ?? []);

  const [bricks, setBricks] = useState<UseSingleBrickConf[]>([]);

  const bricksOfNoLabel = useMemo(
    () => bricks.map((brick: any) => omit(brick, "properties.label")),
    [bricks]
  );

  const handleAddItem = () => {
    props.onAdd?.({ detail: {}, index: values.length });
    setValues(values.concat({}));
  };

  useEffect(() => {
    if (!isEqual(value, values)) {
      setValues(value ?? []);
    }
  }, [value]);

  useEffect(() => {
    if (props.useBrick) {
      const parsedUseBrick: UseSingleBrickConf[] = flatten(
        new Array(props.useBrick)
      );

      setBricks(
        parsedUseBrick.map((brick) => {
          const { properties = {} } = brick;
          if (properties.unique) {
            let parsedValidator: any = [
              uniqueValidatorFN(props, properties, t),
            ];
            if (properties.validator) {
              parsedValidator = [
                ...flatten(new Array(properties.validator)),
                ...parsedValidator,
              ];
            }
            return {
              ...brick,
              properties: {
                ...brick.properties,
                validator: parsedValidator,
              },
            };
          } else {
            return brick;
          }
        })
      );
    }
  }, [props.useBrick, props.curElement]);
  // istanbul ignore next;
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

  // istanbul ignore next;
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
      props.onRemove?.({
        detail: values.find((_, i) => i === index) as Record<string, any>,
        index,
      });
    },
    [props, values]
  );
  const addButtonDisabled = useMemo(
    () => getRealValue(disabledAddButton, [values]),
    [disabledAddButton, values]
  );
  const addButtonHide = useMemo(
    () => getRealValue(hideAddButton, [values]),
    [hideAddButton, values]
  );

  return (
    <WrappedFormItem {...(props as FormItemProps)} validator={validate}>
      <div className="dynamic-form-wrapper" ref={formWrapperRef}>
        {values.map((value, index) => {
          const hideRemoveBtn = getRealValue(hideRemoveButton, [value, index]);
          const removeBtnDisabled = getRealValue(disabledRemoveButton, [
            value,
            index,
          ]);
          return (
            <div className="dynamic-form-item" key={index}>
              {!isEmpty(bricks) && (
                <WrappedForm
                  layout="vertical"
                  formStyle={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                  className="dynamic-form"
                  values={value}
                  defaultEmitValuesChange={false}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onValuesChange={(value) => handleValuesChange(value, index)}
                >
                  <ReactUseMultipleBricks
                    useBrick={
                      (index === 0
                        ? bricks
                        : bricksOfNoLabel) as UseSingleBrickConf[]
                    }
                    data={value}
                  />
                  {!hideRemoveBtn && (
                    <div
                      className={classNames("remove-btn-wrapper", {
                        "remove-btn-disabled-wrapper": removeBtnDisabled,
                      })}
                    >
                      <WrappedIcon
                        lib="easyops"
                        category="assets-inventory"
                        icon="out"
                        className={classNames("remove-btn", {
                          "remove-btn-disabled": removeBtnDisabled,
                        })}
                        onClick={() => handleRemoveItem(index)}
                      />
                    </div>
                  )}
                </WrappedForm>
              )}
            </div>
          );
        })}
        <div
          className={classNames({
            "add-btn-wrapper-disabled": addButtonDisabled,
          })}
        >
          <WrappedButton
            className={classNames("add-btn", {
              "add-btn-hide": addButtonHide,
              "add-btn-disabled": addButtonDisabled,
            })}
            icon={{
              category: "assets-inventory",
              icon: "xin",
              lib: "easyops",
            }}
            type="dashed"
            buttonStyle={{
              width: "100%",
              color: addButtonDisabled ? "var(--text-color-disabled)" : "",
            }}
            onClick={handleAddItem}
          >
            添加
          </WrappedButton>
        </div>
      </div>
      <slot name="helpSlot"></slot>
    </WrappedFormItem>
  );
}

export { DynamicFormItem };
