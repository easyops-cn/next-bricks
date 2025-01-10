import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
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

describe("eo-upload-image", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-upload-image") as UploadImage;
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

    expect(element.shadowRoot?.querySelectorAll(".image-item").length).toBe(2);
    expect(element.shadowRoot?.querySelectorAll("eo-image").length).toBe(1);

    expect(
      element.shadowRoot
        ?.querySelectorAll(".delete-icon")[0]
        .getAttribute("icon")
    ).toBe("delete");
    expect(
      element.shadowRoot
        ?.querySelectorAll(".delete-icon")[1]
        .getAttribute("icon")
    ).toBe("close");

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(
          ".delete-icon"
        )[1] as HTMLInputElement
      );
    });

    expect(element.shadowRoot?.querySelectorAll(".image-item").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("max count", async () => {
    const element = document.createElement("eo-upload-image") as UploadImage;
    element.maxCount = 1;
    const files1 = [new File([""], "success1.png", { type: "image/png" })];
    const files2 = [new File([""], "success2.png", { type: "image/png" })];
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
        { target: { files: files1 } }
      );
    });
    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.objectContaining({
          detail: expect.arrayContaining([
            expect.objectContaining({ status: "done", file: files1[0] }),
          ]),
        })
      );
    });

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector("input") as HTMLInputElement,
        { target: { files: files2 } }
      );
    });
    await waitFor(() => {
      expect(onChange).toBeCalledWith(
        expect.objectContaining({
          detail: expect.arrayContaining([
            expect.objectContaining({ status: "done", file: files2[0] }),
          ]),
        })
      );
    });

    expect(element.shadowRoot?.querySelectorAll("eo-image").length).toBe(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
