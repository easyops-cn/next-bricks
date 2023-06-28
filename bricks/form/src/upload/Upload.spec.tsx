import React from "react";
import { describe, test, expect } from "@jest/globals";
import { waitFor, act, render, fireEvent } from "@testing-library/react";
import { ItemActions, Upload, UploadActions } from "./Upload.js";
import { FileData } from "./utils.js";

jest.mock("@next-core/theme", () => ({}));

jest.mock("@next-core/http", () => ({
  http: {
    request: jest.fn((url: string, init?: RequestInit) => {
      const file = (init?.body as FormData).get("file") as File;
      return new Promise((resolve, reject) => {
        file.name.endsWith("jpeg")
          ? reject("fetch error")
          : resolve("fetch success");
      });
    }),
  },
}));

jest.useFakeTimers();

describe("Upload", () => {
  test("should work when autoUpload is false", async () => {
    const uploadRender = (fileDataList: FileData[], actions: UploadActions) => {
      return <div onClick={actions.upload} className="upload-btn" />;
    };
    const itemRender = (
      fileData: FileData,
      fileDataList: FileData[],
      actions: ItemActions
    ) => {
      return <div onClick={actions.remove} className="upload-item" />;
    };

    const files = [
      new File([""], "success1.png", { type: "image/png" }),
      new File([""], "filtered.mp4", { type: "video/mp4" }),
      new File([""], "success2.jpeg", { type: "image/jpeg" }),
    ];
    const onChange = jest.fn();

    const { container, unmount } = render(
      <Upload
        uploadRender={uploadRender}
        itemRender={itemRender}
        onChange={onChange}
        autoUpload={false}
        accept="image/*"
      />
    );
    act(() => {
      fireEvent.change(container.querySelector("input") as HTMLInputElement, {
        target: { files },
      });
    });

    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ status: "done", file: files[0] }),
          expect.objectContaining({ status: "done", file: files[2] }),
        ])
      );
    });

    act(() => {
      fireEvent.click(
        container.querySelector(".upload-item") as HTMLInputElement
      );
    });

    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ status: "done", file: files[2] }),
        ])
      );
    });

    unmount();
  });

  test("should work when autoUpload is true", async () => {
    const uploadRender = (fileDataList: FileData[], actions: UploadActions) => {
      return <div onClick={actions.upload} className="upload-btn" />;
    };
    const itemRender = (
      fileData: FileData,
      fileDataList: FileData[],
      actions: ItemActions
    ) => {
      return <div onClick={actions.remove} className="upload-item" />;
    };

    const files = [
      new File([""], "success1.png", { type: "image/png" }),
      new File([""], "filtered.mp4", { type: "video/mp4" }),
      new File([""], "error.jpeg", { type: "image/jpeg" }),
    ];
    const onChange = jest.fn();

    const { container, unmount } = render(
      <Upload
        uploadRender={uploadRender}
        itemRender={itemRender}
        onChange={onChange}
        autoUpload={true}
        uploadName="file"
        accept="image/*"
      />
    );
    act(() => {
      fireEvent.change(container.querySelector("input") as HTMLInputElement, {
        target: { files },
      });
    });

    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ status: "done", file: files[0] }),
          expect.objectContaining({ status: "error", file: files[2] }),
        ])
      );
    });

    unmount();
  });
});
