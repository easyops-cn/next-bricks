import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
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

describe("presentational.code-display", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "presentational.code-display"
    ) as CodeDisplay;
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

    expect(element.shadowRoot?.querySelector("pre")).toMatchInlineSnapshot(`
      <pre
        class="prism-code language-javascript line-numbers"
        style="color: rgb(204, 204, 204); background: rgb(45, 45, 45); font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; tab-size: 4; hyphens: none; --max-lines: 10; --min-lines: 3;"
      >
        <div
          class="token-line"
        >
          <span
            class="line-number"
          >
            1
          </span>
          <span>
            <span
              class="token keyword"
              style="color: rgb(204, 153, 205);"
            >
              const
            </span>
            <span
              class="token plain"
            >
               a 
            </span>
            <span
              class="token operator"
              style="color: rgb(103, 205, 204);"
            >
              =
            </span>
            <span
              class="token plain"
            >
               
            </span>
            <span
              class="token number"
              style="color: rgb(240, 141, 73);"
            >
              1
            </span>
            <span
              class="token punctuation"
              style="color: rgb(204, 204, 204);"
            >
              ;
            </span>
          </span>
        </div>
      </pre>
    `);
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
    const element = document.createElement(
      "presentational.code-display"
    ) as CodeDisplay;

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
