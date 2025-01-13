import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./";
import * as runtime from "@next-core/runtime";
import { EoImgIcon } from "./index.js";

jest.mock("@next-core/runtime");
jest.spyOn(runtime, "getBasePath").mockReturnValue("/next/");

window.PUBLIC_ROOT = "/sa-static/-/";

describe("eo-img-icon", () => {
  test("should render null if imgSrc is falsy", async () => {
    const element = document.createElement("eo-img-icon") as EoImgIcon;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.querySelector("img")).toBeFalsy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("basic usage", async () => {
    const element = document.createElement("eo-img-icon") as EoImgIcon;
    element.imgSrc = "https://test.com/image.jpg";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "https://test.com/image.jpg"
    );

    await act(async () => {
      element.imgSrc =
        "api/gateway/object_store.object_store.GetObject/api/v1/objectStore/bucket/next-builder/object/test.jpeg";
    });
    expect(element.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "api/gateway/object_store.object_store.GetObject/api/v1/objectStore/bucket/next-builder/object/test.jpeg"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("relative path", async () => {
    const element = document.createElement("eo-img-icon") as EoImgIcon;
    element.imgSrc = "dist/image.jpg";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "/sa-static/-/dist/image.jpg"
    );

    await act(async () => {
      element.noPublicRoot = true;
    });
    expect(element.shadowRoot?.querySelector("img")?.getAttribute("src")).toBe(
      "/next/dist/image.jpg"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
