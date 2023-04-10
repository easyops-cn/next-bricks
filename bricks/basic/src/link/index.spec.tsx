import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import { Link } from "./index.js";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/runtime", () => ({
  getHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
    location: {
      pathname: "",
      search: "",
    },
    createHref: (path: Location) => {
      return path.pathname + path.hash + path.search
    },
  }),
}))

beforeEach(() => {
  jest.clearAllMocks();
})

describe("basic.general-button", () => {
  test("basic usage", async () => {
    const element1 = document.createElement("basic.general-link") as Link;
    const element2 = document.createElement("basic.general-link") as Link;
    const element3 = document.createElement("basic.general-link") as Link;
    element1.href = "/abc";
    element1.textContent = "hello world";
    element1.icon = {} as GeneralIconProps;

    element2.href = "/efg"
    element2.textContent = "disabled link";
    element2.disabled = true;


    element3.href = "/h";
    element3.textContent = "replace link";
    element3.replace = true;

    const mockElement1ClickEvent = jest.fn();
    const mockElement2ClickEvent = jest.fn();
    element1.addEventListener("click", mockElement1ClickEvent);
    element2.addEventListener("click", mockElement2ClickEvent);

    expect(element1.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element1);
      document.body.appendChild(element2);
      document.body.appendChild(element3);
    });
    expect(element1.shadowRoot).toBeTruthy();
    expect(element1.shadowRoot?.childNodes.length).toBe(2);

    expect(element1.innerHTML).toBe("hello world");
    expect(element1.shadowRoot?.querySelector("a")?.childNodes.length).toBe(2);
    expect(element1.shadowRoot?.querySelector("a")?.href).toBe('http://localhost/abc');


    expect(element2.innerHTML).toBe("disabled link");
    expect(element2.shadowRoot?.querySelector("a")?.childNodes.length).toBe(1);
    expect(element2.shadowRoot?.querySelector("a")?.href).toBe('http://localhost/efg');

    expect(mockElement1ClickEvent).toBeCalledTimes(0);
    expect(mockElement2ClickEvent).toBeCalledTimes(0);
    expect(mockHistoryPush).toBeCalledTimes(0);

    act(() => {
      element1.shadowRoot?.querySelector("a")?.click();
      element2.shadowRoot?.querySelector("a")?.click();
    });

    expect(mockHistoryPush).toBeCalledTimes(1);
    expect(mockElement1ClickEvent).toBeCalledTimes(1);
    expect(mockElement2ClickEvent).toBeCalledTimes(0);

    expect(mockHistoryReplace).toBeCalledTimes(0);

    act(() => {
      element3.shadowRoot?.querySelector("a")?.click();
    })

    expect(mockHistoryReplace).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element1);
      document.body.removeChild(element2);
      document.body.removeChild(element3);
    });
    expect(element1.shadowRoot?.childNodes.length).toBe(0);
    expect(element2.shadowRoot?.childNodes.length).toBe(0);
    expect(element3.shadowRoot?.childNodes.length).toBe(0);
  });
});
