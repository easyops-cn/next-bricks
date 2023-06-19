import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { unwrapProvider } from "@next-core/utils/general";
import "@next-core/theme";
import type { httpRequest } from "@next-bricks/basic/data-providers/httpRequest";
import {
  getUid,
  type FileData,
  symbolForAbortController,
  acceptValidator,
  sizeValidator,
  imageValidator,
  getUserData,
  UploadStatus,
} from "./utils.js";

const request = unwrapProvider<typeof httpRequest>("basic.http-request");

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
        Promise.allSettled([file, sizeValidator(file), imageValidator(file)])
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

          const status: UploadStatus = errors.length
            ? "error"
            : autoUpload
            ? "uploading"
            : "done";

          const userData = await getUserData(file);
          return { uid, file, status, userData, errors };
        }
      )
    );
  };

  const handleUploadSuccess = (fileData: FileData, response: unknown) => {
    fileData.response = response;
    fileData.status = "done";
    setInternalFileDataList((fileDataList) => {
      const newFileDataList = [...fileDataList];
      onChange?.(newFileDataList);
      return newFileDataList;
    });
  };

  const handleUploadError = (fileData: FileData, error: Error) => {
    fileData.errors!.push(error);
    fileData.status = "error";
    setInternalFileDataList((fileDataList) => {
      const newFileDataList = [...fileDataList];
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

    const req = request(action!, {
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
      {uploadRender(internalFileDataList, {
        upload: () => inputRef.current?.click(),
      })}
      <div className="image-list">
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
    </>
  );
}
