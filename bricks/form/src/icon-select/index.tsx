import React, { useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import { FormItemElement } from "../form-item/FormItemElement.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";
import type { MenuIcon } from "@next-shared/general/types";
import type { FormItem, FormItemProps } from "../form-item/index.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type {
  Modal,
  ModalProps,
  ModalEvents,
  ModalMapEvents,
} from "@next-bricks/containers/modal";
import type {
  Radio,
  RadioProps,
  RadioEvents,
  RadioEventsMapping,
} from "../radio/index.js";
import type {
  GeneralSearch,
  SearchProps,
  SearchEvents,
  SearchEventsMap,
} from "../search/index.js";
import type {
  getLibs as _getLibs,
  LibInfo,
  IconInfo,
} from "@next-bricks/icons/data-providers/get-libs";
import type { searchIcons as _searchIcons } from "@next-bricks/icons/data-providers/search-icons";
import { COLORS_MAP, getColor } from "./utils.js";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const getLibs = unwrapProvider<typeof _getLibs>("icons.get-libs");
const searchIcons = unwrapProvider<typeof _searchIcons>("icons.search-icons");
const WrappedGeneralRadio = wrapBrick<
  Radio,
  RadioProps,
  RadioEvents,
  RadioEventsMapping
>("form.general-radio", {
  onValueChange: "change",
  onOptionsChange: "optionsChange",
});
const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);
const WrappedModal = wrapBrick<Modal, ModalProps, ModalEvents, ModalMapEvents>(
  "containers.general-modal",
  {
    onClose: "close",
    onConfirm: "confirm",
    onCancel: "cancel",
    onOpen: "open",
  }
);
const WrappedSearch = wrapBrick<
  GeneralSearch,
  SearchProps,
  SearchEvents,
  SearchEventsMap
>("form.general-search", {
  onBlur: "blur",
  onChange: "change",
  onSearch: "search",
});
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

type Icon = GeneralIconProps & { color?: string };

export interface IconSelectProps {
  name?: string;
  label?: string;
  value?: Icon;
  disabled?: boolean;
  required?: boolean;
  message?: Record<string, string>;
}

/**
 * 构件 icon-select
 */
export
@defineElement("form.icon-select", {
  styleTexts: [styleText],
})
class IconSelect extends FormItemElement implements IconSelectProps {
  /**
   * 字段名称
   */
  @property()
  accessor name: string | undefined;

  /**
   * 字段说明
   */
  @property()
  accessor label: string | undefined;

  /**
   * 值
   */
  @property({
    attribute: false,
  })
  accessor value: Icon | undefined;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 是否必填
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * 是否必填
   */
  @property({
    attribute: false,
  })
  accessor message: Record<string, string> | undefined;

  /**
   * 值变化时触发
   */
  @event({ type: "change" })
  accessor #change!: EventEmitter<Icon | undefined>;
  handleChange = (value?: Icon) => {
    this.value = value;
    this.#change.emit(value);
  };

  render() {
    return (
      <IconSelectComponent
        formElement={this.getFormElement()}
        curElement={this}
        name={this.name}
        label={this.label}
        value={this.value}
        required={this.required}
        disabled={this.disabled}
        message={this.message}
        onChange={this.handleChange}
        trigger="handleChange"
      />
    );
  }
}

const emptyIcon = {
  lib: "easyops",
  icon: "empty-icon",
  category: "common",
} as Icon;

interface IconSelectComponentProps extends FormItemProps, IconSelectProps {
  onChange?: (value?: Icon) => void;
}

export function IconSelectComponent(props: IconSelectComponentProps) {
  const { t } = useTranslation(NS);
  const { disabled, onChange } = props;

  const modalRef = useRef<Modal>(null);

  const [iconLibs, setIconLibs] = useState<LibInfo[]>([]);
  const [searchParams, setSearchParams] = useState<{
    q?: string;
    lib?: string;
  }>({});
  const [iconList, setIconList] = useState<IconInfo[]>([]);

  useEffect(() => {
    getLibs().then((libs) => {
      setIconLibs(libs);
      setSearchParams({ ...searchParams, lib: libs[0].lib });
    });
  }, []);

  const handleSearchIcons = (params: { q?: string; lib?: string }) => {
    searchIcons({ lib: params.lib, q: params.q, page: 1, pageSize: 100 }).then(
      (result) => setIconList(result.list)
    );
  };

  const [previewIcon, setPreviewIcon] = useState<GeneralIconProps>();
  const [previewColor, setPreviewColor] = useState<string>();

  useEffect(() => {
    setPreviewIcon(props.value?.lib ? props.value : undefined);
    setPreviewColor(props.value?.color);
  }, [props.value]);

  const [selectedIcon, setSelectedIcon] = useState<GeneralIconProps>();
  const [selectedColor, setSelectedColor] = useState<string>();

  const clearSelect = () => {
    setSelectedIcon(undefined);
    setSelectedColor(undefined);
  };

  const handleModalOpen = () => {
    setSelectedIcon(previewIcon);
    setSelectedColor(previewColor);
    handleSearchIcons(searchParams);
  };

  const handleModalClose = () => {
    clearSelect();
  };

  const handleModalConfirm = () => {
    setPreviewIcon(selectedIcon);
    setPreviewColor(selectedColor);
    const newValue = selectedIcon?.lib
      ? { ...selectedIcon, color: selectedColor }
      : undefined;
    onChange?.(newValue);
    modalRef.current?.close();
  };

  const handleIconSelect = (icon: GeneralIconProps) => {
    setSelectedIcon(icon);
  };

  const handleColorSelect = (color?: string) => {
    setSelectedColor(color);
  };

  return (
    <WrappedFormItem {...(props as FormItemProps)}>
      <span
        onClick={() => !disabled && modalRef.current?.open()}
        className={classNames("show-icon", {
          disabled: disabled,
        })}
        style={{ backgroundColor: getColor(previewColor).background }}
      >
        <WrappedGeneralIcon
          {...(previewIcon || emptyIcon)}
          style={{ color: getColor(previewColor).color }}
        />
      </span>
      <WrappedModal
        ref={modalRef}
        modalTitle={t(K.SELECT_ICON)!}
        width="778px"
        maskClosable={false}
        closeWhenConfirm={false}
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
        onOpen={handleModalOpen}
      >
        <div className="preview-container">
          <div
            className="show-area"
            style={{ backgroundColor: getColor(selectedColor).background }}
          >
            <WrappedGeneralIcon
              {...(selectedIcon || emptyIcon)}
              style={{ color: getColor(selectedColor).color }}
            />
            {selectedIcon && (
              <div className="delete-wrapper" onClick={() => clearSelect()}>
                <div className="delete-icon">
                  <WrappedGeneralIcon
                    lib="easyops"
                    category="default"
                    icon="delete"
                    style={{ color: "var(--theme-red-color)" }}
                  />
                </div>
              </div>
            )}
          </div>
          <span className="preview-icon-name">{selectedIcon?.icon}</span>
        </div>
        <div className="select-icon-container">
          {
            <>
              <span className="label">{t(K.COLOR)}：</span>
              <div className="select-color-area">
                {Object.keys(COLORS_MAP).map((item) => {
                  return (
                    <div
                      className="color-box"
                      style={{ backgroundColor: getColor(item).color }}
                      key={item}
                      onClick={() => handleColorSelect(item)}
                    />
                  );
                })}
                <div
                  className="color-box empty-color"
                  onClick={() => handleColorSelect(undefined)}
                >
                  <div className="empty-line" />
                </div>
              </div>
            </>
          }
          <span className="label">{t(K.ICON)}：</span>
          <div className="select-icon-area">
            <div className="select-icon-search-bar">
              <WrappedSearch
                value={searchParams.q}
                placeholder={t(K.SEARCH_PLACEHOLDER)!}
                onSearch={(e) => {
                  const newSearchParams = { ...searchParams, q: e.detail };
                  setSearchParams(newSearchParams);
                  handleSearchIcons(newSearchParams);
                }}
              />
              <WrappedGeneralRadio
                options={iconLibs?.map((lib) => {
                  return {
                    label: lib.title,
                    value: lib.lib,
                  };
                })}
                value={searchParams.lib}
                style={{ marginBottom: "-22px" }}
                onValueChange={(e) => {
                  const newSearchParams = {
                    ...searchParams,
                    lib: e.detail as string,
                  };
                  setSearchParams(newSearchParams);
                  handleSearchIcons(newSearchParams);
                }}
              />
            </div>
            <div className="icon-area">
              {iconList.map((iconInfo) => {
                return (
                  <div
                    key={JSON.stringify(iconInfo.icon)}
                    title={iconInfo.title}
                    className="icon-container"
                    onClick={() => {
                      handleIconSelect(iconInfo.icon);
                    }}
                  >
                    <div className="icon-inner-container">
                      <WrappedGeneralIcon {...iconInfo.icon} />
                      <div className="icon-name">{iconInfo.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </WrappedModal>
    </WrappedFormItem>
  );
}
