import React from "react";
import { describe, test, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { ImageComponent } from "./ImageComponent.jsx";
import { ImageListContext, type PreviewImage } from "./ImageListContext.js";

const { Provider } = ImageListContext;

describe("ImageComponent", () => {
  test("should work", () => {
    const onClick = jest.fn();
    const unRegister = jest.fn();
    const registerImage = jest.fn((_uuid: number, _previewImage: PreviewImage) => unRegister);

    const { container, rerender, unmount } = render(
      <Provider
        value={{
          previewImageList: [],
          setCurrentUUid: jest.fn(),
          currentUUid: 0,
          registerImage,
        }}
      >
        <ImageComponent
          index={0}
          src={"src"}
          fallback={"fallback"}
          placeholder={"placeholder"}
          alt={"alt"}
          width={200}
          height={300}
          preview={true}
          onClick={onClick}
        />
      </Provider>
    );

    expect(container.querySelector(".image-mask")).toBeTruthy();
    expect(registerImage).toHaveBeenLastCalledWith(expect.any(Number), {
      alt: "alt",
      index: 0,
      preview: true,
      src: undefined,
      uuid: expect.any(Number),
    });

    fireEvent.click(container.querySelector(".image-wrapper") as Element);
    expect(onClick).toHaveBeenLastCalledWith(expect.any(Number), true);

    rerender(
      <Provider
        value={{
          previewImageList: [],
          setCurrentUUid: jest.fn(),
          currentUUid: 0,
          registerImage,
        }}
      >
        <ImageComponent
          index={0}
          src={"src"}
          fallback={"fallback"}
          placeholder={"placeholder"}
          alt={"alt"}
          width={200}
          height={300}
          preview={false}
          onClick={onClick}
        />
      </Provider>
    );

    expect(container.querySelector(".image-mask")).toBeFalsy();
    expect(registerImage).toHaveBeenLastCalledWith(expect.any(Number), {
      alt: "alt",
      index: 0,
      preview: false,
      src: undefined,
      uuid: expect.any(Number),
    });

    fireEvent.click(container.querySelector(".image-wrapper") as Element);
    expect(onClick).toHaveBeenLastCalledWith(expect.any(Number), false);

    expect(container.querySelectorAll("img").length).toBe(1);

    rerender(
      <Provider
        value={{
          previewImageList: [],
          currentUUid: 0,
          onlyPreview: true,
          setCurrentUUid: jest.fn(),
          registerImage,
        }}
      >
        <ImageComponent
          index={0}
          src={"src"}
          fallback={"fallback"}
          placeholder={"placeholder"}
          alt={"alt"}
          width={200}
          height={300}
          preview={false}
          onClick={onClick}
        />
      </Provider>
    );

    expect(container.querySelectorAll("img").length).toBe(0);

    expect(unRegister).not.toHaveBeenCalled();
    unmount();
    expect(unRegister).toHaveBeenCalled();
  });
});
