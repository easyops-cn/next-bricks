import React, { CSSProperties, useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { TreeSelect, ConfigProvider, theme } from "antd";
import { TreeSelectProps as AntdTreeSelectProps } from "antd/lib/tree-select";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import type { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import { FormItemElementBase } from "@next-shared/form";
import { useCurrentTheme } from "@next-core/react-runtime";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

export interface TreeSelectProps
  extends Pick<
    AntdTreeSelectProps,
    | "value"
    | "allowClear"
    | "disabled"
    | "fieldNames"
    | "filterTreeNode"
    | "maxTagCount"
    | "multiple"
    | "onSearch"
    | "onSelect"
    | "onChange"
    | "onTreeExpand"
    | "loading"
    | "placeholder"
    | "size"
    | "showSearch"
    | "searchValue"
    | "treeData"
    | "treeDefaultExpandAll"
    | "treeExpandedKeys"
  > {
  shadowRoot: ShadowRoot | null;
  checkable?: boolean;
  suffixIcon?: GeneralIconProps;
  popupPlacement?: AntdTreeSelectProps["placement"];
  dropdownStyle?: CSSProperties;
  maxTagCount?: number | "responsive";
  onChange?: (value: AntdTreeSelectProps["value"]) => void;
}

/**
 * 树选择器
 * @author sailor
 * @category form-input-basic
 */
export
@defineElement("eo-tree-select", {
  styleTexts: [styleText],
})
class TreeSelectBrick extends FormItemElementBase implements TreeSelectProps {
  @property()
  accessor name: string | undefined;

  @property()
  accessor label: string | undefined;

  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  @property({
    attribute: false,
  })
  accessor treeData: AntdTreeSelectProps["treeData"];

  @property({ type: Boolean })
  accessor treeDefaultExpandAll: boolean | undefined;

  @property({ attribute: false })
  accessor treeExpandedKeys: string[] | undefined;

  @property({
    attribute: false,
  })
  accessor fieldNames: AntdTreeSelectProps["fieldNames"];

  @property({
    attribute: false,
  })
  accessor value: AntdTreeSelectProps["value"];

  @property()
  accessor placeholder: string | undefined;

  @property({
    type: Boolean,
  })
  accessor multiple: boolean | undefined;

  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  @property({
    type: Boolean,
  })
  accessor checkable: boolean | undefined;

  @property({
    type: Boolean,
  })
  accessor allowClear: boolean | undefined = true;

  @property({
    type: Boolean,
  })
  accessor loading: boolean | undefined = false;

  @property({
    attribute: false,
  })
  accessor filterTreeNode: AntdTreeSelectProps["filterTreeNode"];

  @property({
    type: Boolean,
  })
  accessor showSearch: boolean | undefined = true;

  @property({
    attribute: false,
  })
  accessor suffixIcon: GeneralIconProps | undefined;

  @property()
  accessor popupPlacement: AntdTreeSelectProps["placement"] = "bottomLeft";

  @property()
  accessor size: AntdTreeSelectProps["size"];

  @property({
    attribute: false,
  })
  accessor maxTagCount: number | "responsive" | undefined;

  @property({
    attribute: false,
  })
  accessor dropdownStyle: CSSProperties | undefined;

  /**
   * @detail { value: AntdTreeSelectProps["value"], selectedOptions: DefaultOptionType[] | DefaultOptionType[][] }
   */
  @event({ type: "change" })
  accessor #changeEvent!: EventEmitter<{
    value: AntdTreeSelectProps["value"];
  }>;

  handleOnChange = (value: AntdTreeSelectProps["value"]): void => {
    this.value = value;
    this.#changeEvent.emit({ value });
  };

  @event({ type: "search" })
  accessor #searchEvent!: EventEmitter<string>;

  #handleSearch = (value: string): void => {
    this.#searchEvent.emit(value);
  };

  @event({ type: "select" })
  accessor #selectEvent!: EventEmitter<{ value: AntdTreeSelectProps["value"] }>;

  #handleSelect = (value: AntdTreeSelectProps["value"]): void => {
    this.#selectEvent.emit({ value });
  };

  @event({ type: "expand" })
  accessor #expandEvent!: EventEmitter<{ keys: React.Key[] }>;

  #handleExpand = (keys: React.Key[]): void => {
    this.#expandEvent.emit({ keys });
  };

  render() {
    return (
      <WrappedFormItem
        exportparts="message"
        curElement={this as HTMLElement}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        required={this.required}
        notRender={this.notRender}
        trigger="handleOnChange"
      >
        <TreeSelectElement
          shadowRoot={this.shadowRoot}
          checkable={this.checkable}
          treeData={this.treeData}
          treeDefaultExpandAll={this.treeDefaultExpandAll}
          fieldNames={this.fieldNames}
          filterTreeNode={this.filterTreeNode}
          value={this.value}
          multiple={this.multiple}
          placeholder={this.placeholder}
          loading={this.loading}
          disabled={this.disabled}
          allowClear={this.allowClear}
          showSearch={this.showSearch}
          suffixIcon={this.suffixIcon}
          size={this.size}
          popupPlacement={this.popupPlacement}
          treeExpandedKeys={this.treeExpandedKeys}
          maxTagCount={this.maxTagCount}
          dropdownStyle={this.dropdownStyle}
          onChange={this.handleOnChange}
          onSearch={this.#handleSearch}
          onSelect={this.#handleSelect}
          onTreeExpand={this.#handleExpand}
        />
      </WrappedFormItem>
    );
  }
}

function TreeSelectElement(props: TreeSelectProps): React.ReactElement {
  const {
    shadowRoot,
    checkable,
    loading,
    treeData,
    treeExpandedKeys,
    treeDefaultExpandAll,
    fieldNames,
    value,
    placeholder,
    disabled,
    multiple,
    allowClear,
    popupPlacement,
    dropdownStyle,
    suffixIcon,
    size,
    maxTagCount,
    onChange,
    onSearch,
    onSelect,
    onTreeExpand,
  } = props;

  const currentTheme = useCurrentTheme();

  const cache = useMemo(() => {
    return createCache();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          /* istanbul ignore next */
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider container={shadowRoot as ShadowRoot} cache={cache}>
        <TreeSelect
          getPopupContainer={(trigger) => trigger.parentElement}
          allowClear={allowClear}
          loading={loading}
          disabled={disabled}
          multiple={multiple}
          fieldNames={fieldNames}
          placeholder={placeholder}
          placement={popupPlacement}
          dropdownStyle={dropdownStyle}
          suffixIcon={suffixIcon && <WrappedIcon {...suffixIcon} />}
          maxTagCount={maxTagCount}
          value={value}
          size={size}
          treeData={treeData}
          treeCheckable={checkable}
          treeExpandedKeys={treeExpandedKeys}
          treeDefaultExpandAll={treeDefaultExpandAll}
          onChange={onChange}
          onSelect={onSelect}
          onSearch={onSearch}
          onTreeExpand={onTreeExpand}
          virtual={false}
        />
      </StyleProvider>
    </ConfigProvider>
  );
}
