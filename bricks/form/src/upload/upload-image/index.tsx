import React from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import { type FileData } from "../utils.js";
import { UploadActions, ItemActions, Upload } from "../Upload.js";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedButton = wrapBrick<Button, ButtonProps>("basic.general-button");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

export interface UploadImageProps {
  value?: FileData[];
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
class UploadImage extends ReactNextElement implements UploadImageProps {
  /**
   * 值
   */
  @property({
    attribute: false,
  })
  accessor value: FileData[] | undefined;

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
   * 值变化时触发
   */
  @event({ type: "change" })
  accessor #change!: EventEmitter<FileData[]>;
  #handleChange = (fileDataList: FileData[]) => {
    this.value = fileDataList;
    this.#change.emit(fileDataList);
  };

  render() {
    return (
      <UploadImageComponent
        bucketName={this.bucketName}
        multiple={this.multiple}
        onChange={this.#handleChange}
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

interface UploadImageComponentProps extends UploadImageProps {
  onChange?: (fileDataList: FileData[]) => void;
}

export function UploadImageComponent(props: UploadImageComponentProps) {
  const { value, bucketName, multiple, onChange } = props;
  const { t } = useTranslation(NS);

  const uploadRender = (fileDataList: FileData[], actions: UploadActions) => {
    return (
      <WrappedButton icon={defaultUploadIcon} onClick={actions.upload}>
        {t(K.UPLOAD)}
      </WrappedButton>
    );
  };

  const itemRender = (
    fileData: FileData,
    fileDataList: FileData[],
    actions: ItemActions
  ) => {
    const { uid, file, userData, status, errors } = fileData;
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
          <img className="image" src={userData.url} />
          <div className="infos">
            <div className="file-name">{file!.name}</div>
            {status === "uploading" && <div className="progress"></div>}
            <div className="more-info">
              {status === "done" && (
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

  return (
    <Upload
      uploadRender={uploadRender}
      itemRender={itemRender}
      fileList={value}
      autoUpload={true}
      uploadName="file"
      action={`/next/api/gateway/object_store.object_store.PutObject/api/v1/objectStore/bucket/${bucketName}/object`}
      method="PUT"
      accept="image/*"
      multiple={multiple}
      onChange={onChange}
    />
  );
}
