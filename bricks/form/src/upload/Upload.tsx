import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "@next-core/theme";
import { http } from "@next-core/http";
import {
  getUid,
  type FileData,
  symbolForAbortController,
  acceptValidator,
  sizeValidator,
  UploadStatus,
} from "./utils.js";

export interface UploadActions {
  upload: () => void;
}

export interface ItemActions {
  remove: () => void;
}

export interface UploadProps {
  uploadRender: (
    fileDataList: FileData[],
    actions: UploadActions
  ) => React.ReactElement;
  itemRender: (
    fileData: FileData,
    fileDataList: FileData[],
    actions: ItemActions
  ) => React.ReactElement;
  fileList?: FileData[];
  autoUpload?: boolean;
  uploadName?: string;
  action?: string;
  method?: string;
  accept?: string;
  multiple?: boolean;
  beforeUploadValidators?: ((file: File, files: File[]) => Promise<unknown>)[];
  beforeUploadUserDataProcessor?: (
    file: File,
    fileDataList: { file: File; errors: Error[] }[]
  ) => Promise<any>;
  onChange?: (fileDataList: FileData[]) => void;
}

export function Upload(props: UploadProps) {
  const {
    uploadRender,
    itemRender,
    autoUpload,
    onChange,
    uploadName = "file",
    action,
    method,
    accept,
    beforeUploadValidators = [],
    beforeUploadUserDataProcessor,
    multiple,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [internalFileDataList, setInternalFileDataList] = useState<FileData[]>(
    []
  );

  useEffect(() => {
    setInternalFileDataList(props.fileList || []);
  }, [props.fileList]);

  const beforeLoadFilter = (files: File[]) => {
    return files.filter((file) => acceptValidator(file, accept));
  };

  const beforeLoadValidator = async (files: File[]) => {
    const results = await Promise.all(
      files.map((file) =>
        Promise.allSettled([
          file,
          sizeValidator(file),
          ...beforeUploadValidators.map((validator) => validator(file, files)),
        ])
      )
    );
    return results.map(([_file, ...validatorResult]) => {
      const file = (_file as PromiseFulfilledResult<File>).value;
      const errors: Error[] = [];

      validatorResult.forEach((result) => {
        result.status === "rejected" && errors.push(result.reason);
      });

      return { file, errors };
    });
  };

  const beforeLoadProcessor = async (
    fileDataList: { file: File; errors: Error[] }[]
  ) => {
    return Promise.all(
      fileDataList.map(
        async ({
          file,
          errors,
        }: {
          file: File & { uid?: string };
          errors: Error[];
        }) => {
          const uid = getUid();
          file.uid = uid;
          const name = file.name;

          const status: UploadStatus = errors.length
            ? "error"
            : autoUpload
            ? "uploading"
            : "done";

          const userData = await beforeUploadUserDataProcessor?.(
            file,
            fileDataList
          );
          return { uid, file, name, status, userData, errors };
        }
      )
    );
  };

  const handleUploadSuccess = (fileData: FileData, response: unknown) => {
    setInternalFileDataList((fileDataList) => {
      const newFileDataList = fileDataList.map((_fileData) => {
        return _fileData.uid === fileData.uid
          ? {
              ..._fileData,
              response,
              status: "done" as UploadStatus,
            }
          : _fileData;
      });
      onChange?.(newFileDataList);
      return newFileDataList;
    });
  };

  const handleUploadError = (fileData: FileData, error: Error) => {
    setInternalFileDataList((fileDataList) => {
      const newFileDataList = fileDataList.map((_fileData) => {
        return _fileData.uid === fileData.uid
          ? {
              ..._fileData,
              errors: _fileData.errors?.concat(error),
              status: "error" as UploadStatus,
            }
          : _fileData;
      });
      onChange?.(newFileDataList);
      return newFileDataList;
    });
  };

  const handleFileRemove = (removedFileData: FileData) => {
    setInternalFileDataList((fileDataList) => {
      const newFileDataList = fileDataList.filter(
        (fileData) => fileData.uid !== removedFileData.uid
      );
      onChange?.(newFileDataList);
      return newFileDataList;
    });
  };

  const handleRemove = (fileData: FileData) => {
    if (fileData.status === "uploading") {
      fileData[symbolForAbortController]?.abort();
    }
    handleFileRemove(fileData);
  };

  const uploadFile = (fileData: FileData) => {
    const formData = new FormData();
    const abortController = new AbortController();
    fileData[symbolForAbortController] = abortController;
    formData.append(uploadName, fileData.file!, fileData.file!.name);

    const req = http.request(action!, {
      method,
      body: formData,
      signal: abortController.signal,
    });

    req
      .then((response) => handleUploadSuccess(fileData, response))
      .catch((error) => handleUploadError(fileData, error));

    return req;
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const originFiles = [...event.target.files!];
    event.target.value = "";

    const filteredFiles = beforeLoadFilter(originFiles);
    const validatedFiles = await beforeLoadValidator(filteredFiles);
    const processedFileDataList = await beforeLoadProcessor(validatedFiles);
    setInternalFileDataList((fileDataList) => {
      const newFileDataList = fileDataList.concat(processedFileDataList);
      onChange?.(newFileDataList);
      return newFileDataList;
    });

    processedFileDataList.forEach(
      (fileData) => fileData.status === "uploading" && uploadFile(fileData)
    );
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        hidden
        onChange={handleInputChange}
      />
      <div className="upload-wrapper">
        {uploadRender(internalFileDataList, {
          upload: () => inputRef.current?.click(),
        })}
        <div className="file-list">
          {internalFileDataList.map((fileData) => {
            const actions = {
              remove: () => handleRemove(fileData),
            };
            return (
              <React.Fragment key={fileData.uid}>
                {itemRender(fileData, internalFileDataList, actions)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}
