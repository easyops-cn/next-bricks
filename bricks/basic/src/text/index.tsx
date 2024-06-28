import React, { CSSProperties, useCallback, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import classNames from "classnames";

import { Link, LinkProps } from "../link";

import styleText from "./text.shadow.css";

interface InputProps {
  value?: string;
}
interface InputEvents {
  change: CustomEvent<string>;
  blur: FocusEvent;
}
interface InputEventsMap {
  onChange: "change";
  onBlur: "blur";
}

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedInput = wrapBrick<
  ReactNextElement & { focusInput: () => void },
  InputProps,
  InputEvents,
  InputEventsMap
>("eo-input", {
  onChange: "change",
  onBlur: "blur",
});

export type TextType =
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "disabled"
  | "code"
  | "keyboard"
  | "default";

const typeElementNameMap: Record<string, keyof JSX.IntrinsicElements> = {
  code: "code",
  keyboard: "kbd",
};

export interface TextProps {
  type: TextType;
  editable?: boolean | undefined;
  color?: CSSProperties["color"];
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  textAlign?: CSSProperties["textAlign"];
  lineHeight?: CSSProperties["lineHeight"];
  display?: CSSProperties["display"];
  customStyle?: CSSProperties | undefined;
}
const { defineElement, property, event } = createDecorators();

/**
 * 通用文本构件
 * @author astrid
 *
 * @category text
 */
@defineElement("eo-text", {
  styleTexts: [styleText],
  alias: ["basic.general-text"],
})
class Text extends ReactNextElement implements TextProps {
  /**
   * 文本类型
   * @default "default"
   */
  @property()
  accessor type: TextType = "default";

  /**
   * 是否可编辑
   */
  @property({ type: Boolean })
  accessor editable: boolean | undefined;

  /**
   * 字体大小
   * @default "14px"
   */
  @property()
  accessor fontSize: CSSProperties["fontSize"];

  /**
   * 字体粗细
   * @default "normal"
   */
  @property()
  accessor fontWeight: CSSProperties["fontWeight"];

  /**
   * 字体颜色
   * @default "black"
   */
  @property()
  accessor color: CSSProperties["color"];

  /**
   * 字体行高
   * @default "14px"
   */
  @property()
  accessor lineHeight: CSSProperties["lineHeight"];

  /**
   * 字体对齐方式
   * @default "left"
   */
  @property()
  accessor textAlign: CSSProperties["textAlign"];

  /**
   * 显示类型
   * @default "inline"
   */
  @property()
  accessor display: CSSProperties["display"];

  /**
   * 自定义样式
   */
  @property({ attribute: false }) accessor customStyle:
    | CSSProperties
    | undefined;

  /**
   * 值改变事件
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<string>;

  /**
   * 值更新事件
   */
  @event({ type: "update" })
  accessor #updateEvent!: EventEmitter<string>;

  #handleChange = (value: string) => {
    this.#changeEvent.emit(value);
  };

  #handleUpdate = (value: string) => {
    this.#updateEvent.emit(value);
  };

  render() {
    return (
      <TextComponent
        type={this.type}
        editable={this.editable}
        color={this.color}
        fontSize={this.fontSize}
        fontWeight={this.fontWeight}
        lineHeight={this.lineHeight}
        display={this.display}
        textAlign={this.textAlign}
        customStyle={this.customStyle}
        onChange={this.#handleChange}
        onUpdate={this.#handleUpdate}
      />
    );
  }
}

export interface TextComponentProps extends TextProps {
  onChange?: (value: string) => void;
  onUpdate?: (value: string) => void;
}

export function TextComponent(props: TextComponentProps): React.ReactElement {
  const {
    type,
    editable,
    color,
    fontSize,
    fontWeight,
    lineHeight,
    display,
    textAlign,
    customStyle,
    onChange,
    onUpdate,
  } = props;
  const TextElementName: keyof JSX.IntrinsicElements =
    typeElementNameMap[type as string] || "span";
  const [value, _setValue] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [editingValue, setEditingValue] = useState<string>("");

  const setValue = useCallback((e: Event) => {
    _setValue(
      ((e.target as HTMLSlotElement).getRootNode() as ShadowRoot).host
        .textContent as string
    );
  }, []);

  return editing ? (
    <WrappedInput
      value={editingValue}
      onBlur={() => {
        setEditing(false);
        editingValue !== value && onUpdate?.(editingValue);
      }}
      onChange={(e) => {
        const value = (e as CustomEvent<string>).detail;

        setEditingValue(value);
        onChange?.(value);
      }}
      style={{ width: "100%" }}
      ref={(el) => {
        el && queueMicrotask(() => el?.focusInput?.());
      }}
      data-testid="edit-control"
    />
  ) : (
    <TextElementName
      className={classNames(type)}
      style={
        {
          color: color,
          fontSize: fontSize,
          fontWeight: fontWeight,
          lineHeight: lineHeight,
          display: display,
          textAlign: textAlign,
          ...customStyle,
        } as React.CSSProperties
      }
    >
      <slot
        ref={(el) => {
          el?.addEventListener("slotchange", setValue);

          return () => {
            el?.removeEventListener("slotchange", setValue);
          };
        }}
      />
      {editable && (
        <WrappedLink
          icon={{
            lib: "antd",
            icon: "edit",
          }}
          style={{
            marginLeft: 3,
          }}
          onClick={() => {
            setEditing(true);
            setEditingValue(value);
          }}
          data-testid="edit-button"
        />
      )}
    </TextElementName>
  );
}
export { Text };
