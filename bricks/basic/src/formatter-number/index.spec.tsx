import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoFormatterNumber } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-formatter-number", () => {
  test("basic usage", () => {
    const element = document.createElement(
      "eo-formatter-number"
    ) as EoFormatterNumber;
    element.value = 3141259265;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.lastChild?.textContent).toBe("3,141,259,265");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("currency", () => {
    const element = document.createElement(
      "eo-formatter-number"
    ) as EoFormatterNumber;
    element.value = 3141259265;
    element.type = "currency";

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.lastChild?.textContent).toBe("¥3,141,259,265");

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("percent", () => {
    const element = document.createElement(
      "eo-formatter-number"
    ) as EoFormatterNumber;
    element.value = 0.314159265;
    element.type = "percent";

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.lastChild?.textContent).toBe("31.4159265%");

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("fallback", () => {
    const element = document.createElement(
      "eo-formatter-number"
    ) as EoFormatterNumber;
    element.fallback = "-";

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.lastChild?.textContent).toBe("-");

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("decimals and thousands separators", () => {
    const element = document.createElement(
      "eo-formatter-number"
    ) as EoFormatterNumber;
    element.fallback = "-";
    element.value = 314159.265;
    element.decimals = 2;
    element.thousandsSeparators = false;

    act(() => {
      document.body.appendChild(element);
    });

    expect(element.shadowRoot?.lastChild?.textContent).toBe("314159.27");

    act(() => {
      document.body.removeChild(element);
    });
  });
});
