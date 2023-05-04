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
      return path.pathname + path.hash + path.search;
    },
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("basic.general-button", () => {
  test("basic usage", async () => {
    const element1 = document.createElement("basic.general-link") as Link;
    const element2 = document.createElement("basic.general-link") as Link;
    const element3 = document.createElement("basic.general-link") as Link;
    const element4 = document.createElement("basic.general-link") as Link;
    const element5 = document.createElement("basic.general-link") as Link;
    element1.href = "http://www.xx.com";
    element1.textContent = "hello world";
    element1.icon = {} as GeneralIconProps;

    element2.href = "www.xx.com";
    element2.textContent = "disabled link";
    element2.disabled = true;

    element3.url = "http://xx.com/replace";
    element3.textContent = "replace link";
    element3.replace = true;

    element4.url = "/next-page";
    element4.textContent = "current-page";

    element5.textContent = "empty link";

    const mockElement1ClickEvent = jest.fn();
    const mockElement2ClickEvent = jest.fn();
    element1.addEventListener("click", mockElement1ClickEvent);
    element2.addEventListener("click", mockElement2ClickEvent);

    expect(element1.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element1);
      document.body.appendChild(element2);
      document.body.appendChild(element3);
      document.body.appendChild(element4);
      document.body.appendChild(element5);
    });
    expect(element1.shadowRoot).toBeTruthy();
    expect(element1.shadowRoot?.childNodes.length).toBe(2);

    expect(element1.innerHTML).toBe("hello world");
    expect(element1.shadowRoot?.querySelector("a")?.childNodes.length).toBe(2);
    expect(element1.shadowRoot?.querySelector("a")?.href).toBe(
      "http://www.xx.com/"
    );

    expect(element2.innerHTML).toBe("disabled link");
    expect(element2.shadowRoot?.querySelector("a")?.childNodes.length).toBe(1);
    expect(element2.shadowRoot?.querySelector("a")?.href).toBe(
      "http://localhost/www.xx.com"
    );

    expect(element4.innerHTML).toBe("current-page");
    expect(element4.shadowRoot?.querySelector("a")?.href).toBe(
      "http://localhost/next-page"
    );

    expect(element5.shadowRoot?.querySelector("a")?.href).toBe("");

    expect(mockElement1ClickEvent).toBeCalledTimes(0);
    expect(mockElement2ClickEvent).toBeCalledTimes(0);
    expect(mockHistoryPush).toBeCalledTimes(0);

    act(() => {
      element1.shadowRoot?.querySelector("a")?.click();
      element4.shadowRoot?.querySelector("a")?.click();
    });

    expect(mockHistoryPush).toBeCalledTimes(1);
    expect(mockElement1ClickEvent).toBeCalledTimes(1);
    expect(mockElement2ClickEvent).toBeCalledTimes(0);

    expect(mockHistoryReplace).toBeCalledTimes(0);

    act(() => {
      element3.shadowRoot?.querySelector("a")?.click();
    });

    expect(mockHistoryReplace).toBeCalledTimes(1);

    act(() => {
      // empty link click should not emit event
      element5.shadowRoot?.querySelector("a")?.click();
    });

    expect(mockHistoryReplace).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element1);
      document.body.removeChild(element2);
      document.body.removeChild(element3);
      document.body.removeChild(element4);
      document.body.removeChild(element5);
    });
    expect(element1.shadowRoot?.childNodes.length).toBe(0);
    expect(element2.shadowRoot?.childNodes.length).toBe(0);
    expect(element3.shadowRoot?.childNodes.length).toBe(0);
    expect(element4.shadowRoot?.childNodes.length).toBe(0);
    expect(element4.shadowRoot?.childNodes.length).toBe(0);
  });
});
