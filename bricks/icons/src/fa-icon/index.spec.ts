import { act } from "react-dom/test-utils";
import "./index.js";
import { FaIcon } from "./index.js";

window.fetch = jest.fn((url) =>
  url.endsWith("/oops.json")
    ? Promise.reject(new Error("oops"))
    : Promise.resolve({
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
      })
) as any;

const consoleError = jest.spyOn(console, "error").mockReturnValue();

describe("FaIcon", () => {
  it("renders the icon with the correct prefix and icon name", async () => {
    const icon = document.createElement("icons.fa-icon") as FaIcon;
    icon.prefix = "fas";
    icon.icon = "trash-can";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          fa-icon.shadow.css
      DefineLinearGradient.shadow.css
        </style>,
        <svg
          aria-hidden="true"
          class="svg-inline--fa fa-trash-can "
          data-icon="trash-can"
          data-prefix="fas"
          focusable="false"
          role="img"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M467.9 67.1c-12.5-12.5-32.8-12.5-45.3 0L192 281.6l-83.6-83.7c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l256-256c12.5-12.5 12.5-32.8 0-45.3z"
            fill="currentColor"
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
    const icon = document.createElement("icons.fa-icon") as FaIcon;
    icon.icon = "trash-alt";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          fa-icon.shadow.css
      DefineLinearGradient.shadow.css
        </style>,
        <svg
          aria-hidden="true"
          class="svg-inline--fa fa-trash-can "
          data-icon="trash-can"
          data-prefix="fas"
          focusable="false"
          role="img"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M467.9 67.1c-12.5-12.5-32.8-12.5-45.3 0L192 281.6l-83.6-83.7c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4l256-256c12.5-12.5 12.5-32.8 0-45.3z"
            fill="currentColor"
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
    const icon = document.createElement("icons.fa-icon") as FaIcon;
    icon.prefix = "fas";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          fa-icon.shadow.css
      DefineLinearGradient.shadow.css
        </style>,
      ]
    `);
    act(() => {
      document.body.removeChild(icon);
    });
    expect(icon.shadowRoot?.childNodes.length).toBe(0);
  });

  it("renders an error message when the fetch fails", async () => {
    const icon = document.createElement("icons.fa-icon") as FaIcon;
    icon.prefix = "fas";
    icon.icon = "oops";
    act(() => {
      document.body.appendChild(icon);
    });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(icon.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          fa-icon.shadow.css
      DefineLinearGradient.shadow.css
        </style>,
      ]
    `);
    expect(consoleError).toBeCalledTimes(1);
    expect(consoleError).toBeCalledWith(
      "FontAwesome Icon not found:",
      "fas",
      "oops"
    );
    act(() => {
      document.body.removeChild(icon);
    });
    expect(icon.shadowRoot?.childNodes.length).toBe(0);
  });
});
