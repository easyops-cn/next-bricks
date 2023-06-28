import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { waitFor, fireEvent } from "@testing-library/react";
import "./index.jsx";
import { UploadImage } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

(URL.createObjectURL as any) = jest
  .fn()
  .mockImplementation((file: any) => file.name);
URL.revokeObjectURL = jest.fn();

const LOAD_FAILURE_FLAG = ":LOAD_FAILURE_FLAG";
Object.defineProperty(global.Image.prototype, "src", {
  set(src) {
    if (src.endsWith(LOAD_FAILURE_FLAG)) {
      setTimeout(() => this.onerror(new Error("image load error")), 100);
    } else {
      setTimeout(() => this.onload(), 100);
    }
  },
});

jest.mock("@next-core/http", () => ({
  http: {
    request: jest.fn((url: string, init?: RequestInit) => {
      const file = (init?.body as FormData).get("file") as File;
      return new Promise((resolve, reject) => {
        file.name.endsWith("jpeg")
          ? reject("fetch error")
          : resolve({
              data: {
                objectName: file.name,
              },
            });
      });
    }),
  },
}));

jest.useFakeTimers();

jest.mock("@next-core/theme", () => ({}));

describe("form.upload-image", () => {
  test("basic usage", async () => {
    const element = document.createElement("form.upload-image") as UploadImage;
    const files = [
      new File([""], "success1.png", { type: "image/png" }),
      new File([""], "filtered.mp4", { type: "video/mp4" }),
      new File([""], "error.jpeg", { type: "image/jpeg" }),
    ];
    const onChange = jest.fn();
    element.addEventListener("change", onChange);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector("input") as HTMLInputElement,
        { target: { files } }
      );
    });
    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.objectContaining({
          detail: expect.arrayContaining([
            expect.objectContaining({ status: "done", file: files[0] }),
            expect.objectContaining({ status: "error", file: files[2] }),
          ]),
        })
      );
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
