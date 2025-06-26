import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/dom";
import "./index.js";
import { TagList } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-tag-list", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-tag-list") as TagList;
    element.color = "yellow";
    element.size = "large";
    element.checkable = true;
    element.closable = true;
    element.list = [
      "Item 1",
      { text: "Item 2", closable: false },
      { text: "Item 3", disabled: true },
    ];

    const onTagClick = jest.fn();
    element.addEventListener("tag.click", (e) => {
      onTagClick((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>index.shadow.css</style><div class="tag-list"><eo-tag size="large" color="yellow" closable="" checkable="" text="Item 1">Item 1</eo-tag><eo-tag size="large" color="yellow" checkable="" text="Item 2">Item 2</eo-tag><eo-tag size="large" color="yellow" disabled="" closable="" checkable="" text="Item 3">Item 3</eo-tag></div>"`
    );

    act(() => {
      fireEvent.click(element.shadowRoot!.querySelectorAll("eo-tag")[1]);
    });
    expect(onTagClick).toHaveBeenCalledWith({
      text: "Item 2",
      closable: false,
    });

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
