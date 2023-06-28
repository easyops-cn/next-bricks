import React, { useEffect, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { getBasePath } from "@next-core/runtime";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "../../form-item/index.js";
import classNames from "classnames";
import { UploadActions, ItemActions, Upload } from "../Upload.js";
import { userDataProcessor, imageValidator, type ImageData } from "./utils.js";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("basic.general-button");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);
const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

export interface UploadImageProps {
  label?: string;
  name?: string;
  required?: boolean;
  message?: Record<string, string>;
  value?: ImageData[];
  bucketName: string;
  multiple?: boolean;
}

/**
 * 上传图片构件
 */
export
@defineElement("form.upload-image", {
  styleTexts: [styleText],
})
class UploadImage extends FormItemElementBase implements UploadImageProps {
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
  accessor value: ImageData[] | undefined;

  /**
   * 对象存储桶名字
   */
  @property()
  accessor bucketName!: string;

  /**
   * 是否支持选定的多张图片
   */
  @property({
    type: Boolean,
  })
  accessor multiple: boolean | undefined;

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
   * 值变化时触发
   */
  @event({ type: "change" })
  accessor #change!: EventEmitter<ImageData[]>;
  handleChange = (imageList: ImageData[]) => {
    this.value = imageList;
    this.#change.emit(imageList);
  };

  render() {
    return (
      <UploadImageComponent
        formElement={this.getFormElement()}
        curElement={this}
        name={this.name}
        label={this.label}
        value={this.value}
        required={this.required}
        message={this.message}
        bucketName={this.bucketName}
        multiple={this.multiple}
        onChange={this.handleChange}
        trigger="handleChange"
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

interface UploadImageComponentProps extends UploadImageProps, FormItemProps {
  onChange?: (imageList: ImageData[]) => void;
}

export function UploadImageComponent(props: UploadImageComponentProps) {
  const { value, bucketName, multiple, onChange } = props;
  const { t } = useTranslation(NS);

  const handleChange = (images: ImageData[]) => {
    const processedImages = images?.map((image) => {
      const url =
        image.url ??
        (image.response
          ? `${getBasePath()}api/gateway/object_store.object_store.GetObject/api/v1/objectStore/bucket/${bucketName}/object/${
              image.response.data.objectName
            }`
          : undefined);
      return {
        ...image,
        url,
      };
    });
    onChange?.(processedImages);
  };

  const uploadRender = (fileDataList: ImageData[], actions: UploadActions) => {
    return (
      <WrappedButton icon={defaultUploadIcon} onClick={actions.upload}>
        {t(K.UPLOAD)}
      </WrappedButton>
    );
  };

  const itemRender = (
    fileData: ImageData,
    fileDataList: ImageData[],
    actions: ItemActions
  ) => {
    const {
      uid,
      file,
      url,
      name,
      userData,
      status = "done",
      errors,
    } = fileData;

    return (
      <div
        key={uid}
        className={classNames("image-item", {
          "image-item-done": status === "done",
          "image-item-uploading": status === "uploading",
          "image-item-error": status === "error",
        })}
      >
        <div className="image-item-inner">
          <img className="image" src={userData?.url || url} />
          <div className="infos">
            <div className="file-name">{name}</div>
            {status === "uploading" && <div className="progress"></div>}
            <div className="more-info">
              {status === "done" && userData && (
                <div className="image-size">
                  {`LeaderBoard ${userData?.naturalWidth}*${userData?.naturalHeight}`}
                </div>
              )}
              {status === "error" && (
                <div className="error-info">
                  {errors
                    ?.map((v) => {
                      return v instanceof Error ? v.message : v;
                    })
                    .join(" ")}
                </div>
              )}
              {(status === "done" || status === "error") && userData?.size && (
                <div className="file-size">{userData.size}</div>
              )}
            </div>
          </div>
          <div className="operators">
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

  const validator = (curValue: ImageData[]) => {
    if (curValue?.some((file) => file.status === "uploading")) {
      return t(K.FILE_UPLOADING);
    }
    return "";
  };

  return (
    <WrappedFormItem {...(props as FormItemProps)} validator={validator}>
      <Upload
        uploadRender={uploadRender}
        itemRender={itemRender}
        fileList={value}
        autoUpload={true}
        uploadName="file"
        action={`${getBasePath()}api/gateway/object_store.object_store.PutObject/api/v1/objectStore/bucket/${bucketName}/object`}
        method="PUT"
        accept="image/*"
        multiple={multiple}
        beforeUploadValidators={[(file) => imageValidator(file)]}
        beforeUploadUserDataProcessor={userDataProcessor}
        onChange={handleChange}
      />
    </WrappedFormItem>
  );
}
