import { act } from "react-dom/test-utils";
import type { FaIcon } from "./index.js";

window.fetch = jest.fn(
  (url) =>
    new Promise((resolve, reject) => {
      setTimeout(
        () => {
          if (url.endsWith("/oops.json")) {
            reject(new Error("oops"));
          } else {
            resolve({
              json: () =>
                Promise.resolve(
                  url.endsWith("/trash-can.json")
                    ? {
                        prefix: "fas",
                        iconName: "trash-can",
                        icon: [
                          512,
                          512,
                          [],
                          "f00c",
                          "M467.9 67.1c-12.5-12.5-32.8-12.5-45.3 0L192 281.6l-83.6-83.7c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l256-256c12.5-12.5 12.5-32.8 0-45.3z",
                        ],
                      }
                    : {}
                ),
            });
          }
        },
        url.endsWith("/will-ignore.json") ? 200 : 100
      );
    })
) as any;

const consoleError = jest.spyOn(console, "error").mockReturnValue();

describe("FaIcon", () => {
  beforeEach(async () => {
    jest.isolateModules(() => {
      import("./index.js");
    });
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders the icon with the correct prefix and icon name", async () => {
    const icon = document.createElement("eo-fa-icon") as FaIcon;
    // expect(icon.constructor).toBe(FaIconClass);
    icon.prefix = "fas";
    icon.icon = "trash-can";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
      jest.advanceTimersByTime(100);
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
        <svg
          fill="currentColor"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M467.9 67.1c-12.5-12.5-32.8-12.5-45.3 0L192 281.6l-83.6-83.7c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l256-256c12.5-12.5 12.5-32.8 0-45.3z"
          />
        </svg>,
      ]
    `);

    act(() => {
      document.body.removeChild(icon);
    });
    expect(icon.shadowRoot?.childNodes.length).toBe(0);
  });

  it("renders the icon with the unset prefix and an alias icon", async () => {
    const icon = document.createElement("eo-fa-icon") as FaIcon;
    icon.icon = "will-ignore";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
    });
    // Set icon again, but will be resolved earlier than the previous one.
    icon.icon = "trash-alt";
    await act(async () => {
      await (global as any).flushPromises();
      jest.advanceTimersByTime(200);
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
        <svg
          fill="currentColor"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M467.9 67.1c-12.5-12.5-32.8-12.5-45.3 0L192 281.6l-83.6-83.7c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l256-256c12.5-12.5 12.5-32.8 0-45.3z"
          />
        </svg>,
      ]
    `);

    act(() => {
      document.body.removeChild(icon);
    });
    expect(icon.shadowRoot?.childNodes.length).toBe(0);
  });

  it("renders nothing when the icon is falsy", async () => {
    const icon = document.createElement("eo-fa-icon") as FaIcon;
    icon.prefix = "fas";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
      jest.advanceTimersByTime(100);
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
      ]
    `);
    act(() => {
      document.body.removeChild(icon);
    });
    expect(icon.shadowRoot?.childNodes.length).toBe(0);
  });

  it("renders an error message when the fetch fails", async () => {
    const icon = document.createElement("eo-fa-icon") as FaIcon;
    icon.prefix = "fas";
    icon.icon = "oops";

    const onIconFound = jest.fn();
    icon.addEventListener("icon.found", (e) => {
      onIconFound((e as CustomEvent).detail);
    });

    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
      jest.advanceTimersByTime(100);
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          DefineLinearGradient.shadow.css
      icons.shadow.css
        </style>,
      ]
    `);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "FontAwesome Icon not found:",
      "fas",
      "oops"
    );

    expect(onIconFound).toHaveBeenCalledWith(false);

    act(() => {
      document.body.removeChild(icon);
    });
    expect(icon.shadowRoot?.childNodes.length).toBe(0);
  });
});
