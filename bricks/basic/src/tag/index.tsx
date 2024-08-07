import React, { useEffect, useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { ComponentSize } from "../interface.js";
import styleText from "./tag.shadow.css";
import "@next-core/theme";
import { omit } from "lodash";
import { ALLOWED_COMPONENT_SIZES } from "../constants.js";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const closeIcon: GeneralIconProps = {
  lib: "antd",
  theme: "outlined",
  icon: "close",
};

export enum TagColor {
  blue = "blue",
  "blue-inverse" = "blue-inverse",
  cyan = "cyan",
  "cyan-inverse" = "cyan-inverse",
  geekblue = "geekblue",
  "geekblue-inverse" = "geekblue-inverse",
  grayblue = "grayblue",
  "grayblue-inverse" = "grayblue-inverse",
  gray = "gray",
  "gray-inverse" = "gray-inverse",
  green = "green",
  "green-inverse" = "green-inverse",
  orange = "orange",
  "orange-inverse" = "orange-inverse",
  purple = "purple",
  "purple-inverse" = "purple-inverse",
  red = "red",
  "red-inverse" = "red-inverse",
  yellow = "yellow",
  "yellow-inverse" = "yellow-inverse",
  teal = "teal",
  "teal-inverse" = "teal-inverse",
  pink = "pink",
  "pink-inverse" = "pink-inverse",
}

export interface TagProps {
  size?: ComponentSize;
  icon?: GeneralIconProps;
  color?: TagColor | string;
  outline?: boolean;
  closable?: boolean;
  disabled?: boolean;
  checkable?: boolean;
  checked?: boolean;
  hidden?: boolean;
  ellipsisWidth?: string;
  tagStyle?: React.CSSProperties;
}

export interface TagEvents {
  check?: Event;
  close?: Event;
}

export interface TagMapEvents {
  onCheck: "check";
  onClose: "close";
}

/**
 * 标签构件
 * @author sailor
 *
 * @category display-component
 */
@defineElement("eo-tag", {
  styleTexts: [styleText],
  alias: ["basic.general-tag"],
})
class Tag extends ReactNextElement implements TagProps {
  /**
   * 按钮大小
   * @default "medium"
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 颜色
   */
  @property()
  accessor color: TagColor | string | undefined;

  /** 是否有边线 */
  @property({
    type: Boolean,
    render: false,
  })
  accessor outline: boolean | undefined;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 是否允许关闭
   */
  @property({
    type: Boolean,
  })
  accessor closable: boolean | undefined;

  /**
   * 超过宽度文本隐藏宽度
   */
  @property()
  accessor ellipsisWidth: string | undefined;

  /**
   * 是否允许选择
   */
  @property({
    type: Boolean,
  })
  accessor checkable: boolean | undefined;

  /**
   * 是否选择
   */
  @property({
    type: Boolean,
  })
  accessor checked: boolean | undefined;

  /**
   * 标签自定义样式
   */
  @property({
    attribute: false,
  })
  accessor tagStyle: React.CSSProperties | undefined;

  /**
   * @detail
   * @description 选择事件
   */
  @event({ type: "check" })
  accessor #checkEvent!: EventEmitter<TagProps>;

  handleCheck = (detail: TagProps): void => {
    this.#checkEvent.emit(detail);
  };

  /**
   * @detail
   * @description 关闭事件
   */
  @event({ type: "close" })
  accessor #closeEvent!: EventEmitter<TagProps>;

  handleClose = (detail: TagProps): void => {
    this.hidden = true;
    this.#closeEvent.emit(detail);
  };

  render() {
    return (
      <TagComponent
        size={this.size}
        icon={this.icon}
        color={this.color}
        disabled={this.disabled}
        closable={this.closable}
        checkable={this.checkable}
        checked={this.checked}
        ellipsisWidth={this.ellipsisWidth}
        tagStyle={this.tagStyle}
        onCheck={this.handleCheck}
        onClose={this.handleClose}
      />
    );
  }
}

export interface TagComponentProps extends TagProps {
  onCheck?: (detail: TagProps) => void;
  onClose?: (detail: TagProps) => void;
}

function TagComponent(props: TagComponentProps) {
  const {
    size = "medium",
    icon,
    color: _color,
    disabled,
    closable,
    ellipsisWidth,
    checkable,
    checked: isChecked,
    tagStyle,
    onCheck,
    onClose,
  } = props;
  const color = _color ?? "gray";
  const [checked, setChecked] = useState(isChecked);

  const useDefineColor = useMemo(() => {
    return Object.values(TagColor).includes(color as TagColor);
  }, [color]);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleCheck = () => {
    if (checkable && !disabled) {
      setChecked(!checked);
      onCheck?.(
        omit(
          {
            ...props,
            checked: !checked,
          },
          ["onCheck", "onClose"]
        )
      );
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.(
      omit(
        {
          ...props,
        },
        ["onCheck", "onClose"]
      )
    );
  };

  return (
    <div
      className={classNames(
        "tag",
        ALLOWED_COMPONENT_SIZES.includes(size) ? size : "medium",
        {
          [`color-${color}`]: useDefineColor,
          checkable,
          checked,
          disabled,
          closable,
        }
      )}
      style={{
        ...(!useDefineColor && color
          ? {
              background: color,
              color: "#fff",
            }
          : {}),
        ...(tagStyle ?? {}),
      }}
      onClick={handleCheck}
    >
      <div className="tag-wrapper">
        {icon && <WrappedIcon className="tag-icon custom-icon" {...icon} />}
        <div
          className={classNames({
            ellipsis: ellipsisWidth,
          })}
          style={{
            maxWidth: ellipsisWidth,
          }}
        >
          <slot></slot>
        </div>
        {closable && !disabled && (
          <WrappedIcon
            className="tag-icon close-icon"
            {...closeIcon}
            onClick={handleClose}
          />
        )}
      </div>
    </div>
  );
}

export { Tag };
