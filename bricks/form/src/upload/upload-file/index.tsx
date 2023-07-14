import React, { useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { useCurrentTheme } from "@next-core/react-runtime";
import { wrapBrick } from "@next-core/react-element";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type {
  EasyOpsIcon,
  EasyOpsIconProps,
} from "@next-bricks/icons/easyops-icon";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../../form-item/index.js";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { Trans } from "react-i18next";
import { K, NS, locales } from "./i18n.js";
import { ItemActions, UploadActions, Upload } from "../Upload.js";
import { FileData } from "../utils.js";
import classNames from "classnames";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedEasyopsIcon = wrapBrick<EasyOpsIcon, EasyOpsIconProps>(
  "eo-easyops-icon"
);
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

export interface UploadFileProps {
  label?: string;
  name?: string;
  required?: boolean;
  message?: Record<string, string>;
  value?: FileData[];
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
  overMaxCountMode?: "ignore" | "replace";
  uploadDraggable?: boolean;
  draggableUploadTip?: string;
  autoUpload?: boolean;
  url?: string;
  method?: string;
  uploadName?: string;
}

/**
 * 上传文件
 */
export
@defineElement("eo-upload-file", {
  styleTexts: [styleText],
})
class EoUploadFile extends FormItemElementBase implements UploadFileProps {
  /**
   * 字段说明
   */
  @property()
  accessor label: string | undefined;

  /**
   * 字段名称
   */
  @property()
  accessor name: string | undefined;

  /**
   * 是否必填
   */
  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  /**
   * 校验文本信息
   */
  @property({
    attribute: false,
  })
  accessor message: Record<string, string> | undefined;

  /**
   * 值
   */
  @property({
    attribute: false,
  })
  accessor value: FileData[] | undefined;

  /**
   * 是否支持多选
   */
  @property({
    type: Boolean,
  })
  accessor multiple: boolean | undefined;

  /**
   * 接受上传的文件类型，多个之间用 `,` 连接
   */
  @property()
  accessor accept: string | undefined;

  /**
   * 最大上传数量
   */
  @property({
    type: Number,
  })
  accessor maxCount: number | undefined;

  /**
   * 超出最大上传数量时文件的保留方式
   */
  @property()
  accessor overMaxCountMode: "ignore" | "replace" = "replace";

  /**
   * 是否可以拖拽上传
   */
  @property({
    type: Boolean,
  })
  accessor uploadDraggable: boolean | undefined;

  /**
   * 拖拽上传的提示信息
   */
  @property()
  accessor draggableUploadTip: string | undefined;

  /**
   * 是否自动上传
   */
  @property({
    type: Boolean,
  })
  accessor autoUpload: boolean = false;

  /**
   * 自动上传的地址
   */
  @property()
  accessor url: string | undefined;

  /**
   * 自动上传的方法
   */
  @property()
  accessor method: string = "POST";

  /**
   * 自动上传的文件参数名
   */
  @property()
  accessor uploadName: string = "file";

  /**
   * 值变化时触发
   */
  @event({ type: "change" })
  accessor #change!: EventEmitter<FileData[]>;
  handleChange = (fileDataList: FileData[]) => {
    this.value = fileDataList;
    this.#change.emit(fileDataList);
  };

  render() {
    return (
      <EoUploadFileComponent
        formElement={this.getFormElement()}
        curElement={this}
        label={this.label}
        name={this.name}
        required={this.required}
        message={this.message}
        value={this.value}
        multiple={this.multiple}
        accept={this.accept}
        maxCount={this.maxCount}
        overMaxCountMode={this.overMaxCountMode}
        uploadDraggable={this.uploadDraggable}
        draggableUploadTip={this.draggableUploadTip}
        autoUpload={this.autoUpload}
        url={this.url}
        method={this.method}
        uploadName={this.uploadName}
        trigger="handleChange"
        onChange={this.handleChange}
      />
    );
  }
}

const defaultUploadIcon = {
  lib: "antd",
  icon: "upload",
  theme: "outlined",
} as GeneralIconProps;

const deleteIcon = {
  lib: "easyops",
  category: "default",
  icon: "delete",
} as GeneralIconProps;

const closeIcon = {
  lib: "antd",
  theme: "outlined",
  icon: "close",
} as GeneralIconProps;

const fileTextIcon = {
  lib: "antd",
  icon: "file-text",
  theme: "outlined",
} as GeneralIconProps;

const loadingIcon = {
  lib: "antd",
  icon: "loading",
  theme: "outlined",
} as GeneralIconProps;

interface UploadFileComponentProps extends UploadFileProps, FormItemProps {
  onChange?: (fileDataList: FileData[]) => void;
}

export function EoUploadFileComponent(props: UploadFileComponentProps) {
  const {
    value,
    multiple,
    accept,
    maxCount,
    overMaxCountMode,
    uploadDraggable,
    draggableUploadTip,
    autoUpload,
    url,
    method,
    uploadName,
    onChange,
  } = props;
  const { t } = useTranslation(NS);
  const theme = useCurrentTheme();

  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (fileDataList: FileData[]) => {
    onChange?.(fileDataList);
  };

  const itemRender = (
    fileData: FileData,
    fileDataList: FileData[],
    actions: ItemActions
  ) => {
    const { uid, file, name, userData, status = "done", errors } = fileData;

    return (
      <div
        key={uid}
        className={classNames(
          "upload-item-container",
          status && `upload-item-container-${status}`
        )}
      >
        <div className="upload-item-inner">
          <WrappedIcon
            className={classNames(
              "upload-item-icon",
              status === "uploading" && "upload-icon"
            )}
            {...(status === "uploading" ? loadingIcon : fileTextIcon)}
          />
          <div className="upload-item-infos">
            <div className="upload-item-file-name">{name}</div>
          </div>
          <div className="upload-item-operators">
            <WrappedIcon
              className="delete-icon"
              {...(status === "done" ? deleteIcon : closeIcon)}
              onClick={actions.remove}
            />
          </div>
        </div>
      </div>
    );
  };

  const validator = (curValue: FileData[]) => {
    if (curValue?.some((file) => file.status === "uploading")) {
      return t(K.FILE_UPLOADING);
    }
    return "";
  };

  return (
    <WrappedFormItem {...(props as FormItemProps)} validator={validator}>
      <Upload
        itemRender={itemRender}
        fileList={value}
        multiple={multiple}
        accept={accept}
        maxCount={maxCount}
        overMaxCountMode={overMaxCountMode}
        autoUpload={autoUpload}
        action={url}
        method={method}
        uploadName={uploadName}
        onChange={handleChange}
      >
        {(fileDataList: FileData[], uploadActions: UploadActions) => {
          return uploadDraggable ? (
            <div
              className={classNames(
                "upload-drag-button",
                isDragOver && "upload-drag-button-drag-over"
              )}
              onClick={uploadActions.upload}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragLeave={(e) => {
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                e.dataTransfer.files?.length &&
                  uploadActions.uploadFiles(e.dataTransfer.files);
              }}
            >
              <div className="upload-drag-button-inner">
                <WrappedEasyopsIcon
                  className="upload-drag-button-icon"
                  category="colored-common"
                  icon={theme == "dark-v2" ? "upload-dark" : "upload-light"}
                />
                <div className="upload-drag-text">
                  <Trans
                    i18nKey={t(K.DRAG_UPLOAD_TEXT)}
                    components={{
                      total: <strong />,
                    }}
                  />
                </div>
                {draggableUploadTip && (
                  <div className="upload-drag-tip">{draggableUploadTip}</div>
                )}
              </div>
            </div>
          ) : (
            <WrappedButton
              icon={defaultUploadIcon}
              onClick={uploadActions.upload}
            >
              {t(K.UPLOAD)}
            </WrappedButton>
          );
        }}
      </Upload>
    </WrappedFormItem>
  );
}
