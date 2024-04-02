import React, { useEffect, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../form-item/index.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { ComponentSize } from "../interface.js";
import classNames from "classnames";

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

interface SwitchProps extends FormItemProps {
  curElement: HTMLElement;
  onSwitch: (value: boolean) => void;
  disabled?: boolean;
  size?: ComponentSize;
  value?: boolean;
  checkedText?: string;
  unCheckedText?: string;
  checkedIcon?: GeneralIconProps;
  unCheckedIcon?: GeneralIconProps;
}

const { defineElement, property, event } = createDecorators();

/**
 * 开关
 * @author zhendonghuang
 * @category form-input-basic
 */
export
@defineElement("eo-switch", {
  styleTexts: [styleText],
  alias: ["form.general-switch"],
})
class GeneralSwitch extends FormItemElementBase {
  /**
   * 字段名称
   */
  @property() accessor name: string | undefined;

  /**
   * 字段文本
   */
  @property() accessor label: string | undefined;

  /**
   * 初始值
   */
  @property({ type: Boolean })
  accessor value: boolean | undefined;

  /**
   * 是否禁用
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * 按钮大小，目前只支持small和非small两种大小。
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 选中时的文本
   */
  @property() accessor checkedText: string | undefined;

  /**
   * 非选中时的文本
   */
  @property() accessor unCheckedText: string | undefined;

  /**
   * 选中时的图标
   */
  @property({
    attribute: false,
  })
  accessor checkedIcon: GeneralIconProps | undefined;

  /**
   * 非选中时的文本
   */
  @property({
    attribute: false,
  })
  accessor unCheckedIcon: GeneralIconProps | undefined;

  /**
   * 开关改变时触发
   */
  @event({ type: "switch" }) accessor #switchEvent!: EventEmitter<boolean>;

  handleSwitch = (value: boolean) => {
    Promise.resolve().then(() => {
      this.#switchEvent.emit(value);
    });
  };
  render() {
    return (
      <GeneralSwitchComponent
        formElement={this.getFormElement()}
        curElement={this}
        disabled={this.disabled}
        size={this.size}
        value={this.value}
        onSwitch={this.handleSwitch}
        checkedText={this.checkedText}
        unCheckedText={this.unCheckedText}
        checkedIcon={this.checkedIcon}
        unCheckedIcon={this.unCheckedIcon}
        name={this.name}
        label={this.label}
        notRender={this.notRender}
        helpBrick={this.helpBrick}
        labelBrick={this.labelBrick}
        trigger="handleSwitch"
      />
    );
  }
}

export function GeneralSwitchComponent(props: SwitchProps) {
  const {
    unCheckedIcon,
    checkedIcon,
    checkedText,
    unCheckedText,
    value,
    disabled,
    size,
  } = props;
  const [checked, setChecked] = useState<boolean>();
  useEffect(() => {
    setChecked(value);
  }, [value]);
  const handleSwitchChange = () => {
    props.onSwitch(!checked);
    setChecked(!checked);
  };
  return (
    <WrappedFormItem {...props}>
      <button
        disabled={disabled}
        className={classNames(size, {
          "switch-checked": checked,
          "switch-disabled": disabled,
        })}
        onClick={handleSwitchChange}
      >
        <div className="switch-handle"></div>
        <span className="switch-inner">
          {checkedIcon && checked && (
            <WrappedGeneralIcon {...checkedIcon}></WrappedGeneralIcon>
          )}
          {unCheckedIcon && !checked && (
            <WrappedGeneralIcon {...unCheckedIcon}></WrappedGeneralIcon>
          )}

          {checked ? checkedText : unCheckedText}
        </span>
      </button>
    </WrappedFormItem>
  );
}
