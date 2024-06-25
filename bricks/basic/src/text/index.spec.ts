import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { queryByTestId, getByTestId, fireEvent } from "@testing-library/dom";

import "./index.js";
import { Text } from "./index.js";
describe("eo-text", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-text") as Text;
    const div = document.createElement("div");
    div.textContent = "Hello world";
    element.color = "blue";
    element.fontSize = "20px";
    element.display = "block";
    element.textAlign = "center";
    element.lineHeight = "20px";
    act(() => {
      element.appendChild(div);
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.innerHTML).toBe("<div>Hello world</div>");

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("editable", async () => {
    const element = document.createElement("eo-text") as Text;
    const onChange = jest.fn();
    const onUpdate = jest.fn();

    element.addEventListener("change", onChange);
    element.addEventListener("update", onUpdate);

    act(() => {
      document.body.appendChild(element);
    });

    // click edit button
    expect(
      queryByTestId(element.shadowRoot as unknown as HTMLElement, "edit-button")
    ).toBeNull();

    await act(async () => {
      element.editable = true;
    });

    const editButton = getByTestId(
      element.shadowRoot as unknown as HTMLElement,
      "edit-button"
    );

    expect(editButton).not.toBeNull();
    expect(
      queryByTestId(
        element.shadowRoot as unknown as HTMLElement,
        "edit-control"
      )
    ).toBeNull();

    await act(async () => {
      element.textContent = "a";
      fireEvent.click(editButton);
    });

    const editControl = getByTestId(
      element.shadowRoot as unknown as HTMLElement,
      "edit-control"
    );

    expect(editControl).not.toBeNull();

    // todo: editControl.value 暂时取不到值
    // expect((editControl as HTMLElement & { value?: string }).value).toBe("a");

    // edit control change
    expect(onChange).not.toBeCalled();

    act(() => {
      fireEvent(editControl, new CustomEvent("change", { detail: "b" }));
    });

    expect(onChange).toBeCalledWith(expect.objectContaining({ detail: "b" }));

    // edit control blur
    expect(onUpdate).not.toBeCalled();

    act(() => {
      fireEvent.blur(editControl);
    });

    expect(onUpdate).toBeCalledWith(expect.objectContaining({ detail: "b" }));

    act(() => {
      document.body.removeChild(element);
    });
  });
});
