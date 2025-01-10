import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import ResizeObserver from "resize-observer-polyfill";
import fileSaver from "file-saver";
import "./";
import { CodeDisplay } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

jest.mock("prismjs/components/prism-markdown.min.js", () => {
  throw new Error();
});

jest.useFakeTimers();

const consoleError = jest.spyOn(console, "error").mockReturnValue();

const spyOnSaveAs = jest.spyOn(fileSaver, "saveAs").mockImplementation(() => {
  // do nothing
});

const copyToClipboard = jest.fn().mockResolvedValue(1 as never);
const showNotification = jest.fn();

customElements.define(
  "basic.copy-to-clipboard",
  class extends HTMLElement {
    resolve = copyToClipboard;
  }
);
customElements.define(
  "basic.show-notification",
  class extends HTMLElement {
    resolve = showNotification;
  }
);
global.ResizeObserver = ResizeObserver as any;

describe("eo-code-display", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-code-display") as CodeDisplay;
    element.language = "javascript";
    element.value = "const a = 1;";
    element.showCopyButton = true;
    element.showExportButton = true;
    element.maxLines = 10;
    element.minLines = 3;
    element.exportFileName = "export.js";

    expect(element.shadowRoot).toBeFalsy();

    await act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector("pre")).toMatchSnapshot();
    const pre = element.shadowRoot?.querySelector("pre") as HTMLPreElement;
    expect(pre.classList.contains("line-numbers")).toBeTruthy();
    expect(pre.style.getPropertyValue("--min-lines")).toBe("3");
    expect(pre.style.getPropertyValue("--max-lines")).toBe("10");

    act(() => {
      fireEvent.click(element.shadowRoot?.querySelector(".copy-icon"));
    });
    await (global as any).flushPromises();
    expect(copyToClipboard).lastCalledWith("const a = 1;");
    expect(showNotification).lastCalledWith(
      expect.objectContaining({ type: "success" })
    );

    act(() => {
      fireEvent.click(element.shadowRoot?.querySelector(".export-icon"));
    });
    expect(spyOnSaveAs).lastCalledWith(expect.any(Blob), "export.js");

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("load language", async () => {
    const element = document.createElement("eo-code-display") as CodeDisplay;

    // base set of languages
    await act(async () => {
      element.language = "javascript";
      document.body.appendChild(element);
    });

    // not in the base set of languages
    await act(async () => {
      element.language = "rust";
    });

    // unsupported language
    await act(async () => {
      element.language = "__unsupported__";
    });
    expect(consoleError).lastCalledWith(
      expect.stringContaining("unsupported language: __unsupported__")
    );

    // load language failed
    await act(async () => {
      element.language = "markdown";
    });
    expect(consoleError).lastCalledWith(
      expect.stringContaining("load language failed: markdown")
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
