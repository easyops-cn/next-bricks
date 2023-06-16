import React from "react";
import { describe, test, expect } from "@jest/globals";
import { waitFor, act, render, fireEvent } from "@testing-library/react";
import { showDialog, DialogComponent } from "./show-dialog.js";

// <sl-dialog> uses those API which is not supported in jsdom.
Element.prototype.getAnimations = jest.fn().mockReturnValue([]);
Element.prototype.animate = jest.fn().mockReturnValue({
  addEventListener: jest.fn(),
});

customElements.define(
  "sl-dialog",
  class HTMLSlDialog extends HTMLElement {
    label: string | undefined;
    noHeader: boolean | undefined;
    open: boolean | undefined;
    hide() {
      this.dispatchEvent(new Event("sl-hide"));
    }
    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });
      const slot = document.createElement("slot");
      shadow.append(slot);
    }
  }
);

customElements.define(
  "basic.general-button",
  class HTMLGeneralButtonElement extends HTMLElement {
    type: string | undefined;
  }
);

customElements.define(
  "icons.antd-icon",
  class HTMLAntdIconElement extends HTMLElement {
    icon: string | undefined;
    theme: string | undefined;
  }
);

describe("showDialog", () => {
  test("general", async () => {
    let promise: Promise<void> | undefined;
    act(() => {
      promise = showDialog({
        content: "Tips",
      });
    });
    await waitFor(() =>
      expect(document.querySelector("basic\\.general-button")).not.toBeNull()
    );
    expect(document.body.childNodes.length).toBe(1);
    await act(async () => {
      (
        document.querySelector("basic\\.general-button") as HTMLElement
      )?.click();
    });
    await promise;
    expect(document.body.childNodes.length).toBe(0);
  });
});

describe("DialogComponent", () => {
  test("type success", () => {
    const { asFragment, container, unmount } = render(
      <DialogComponent type="success" content="Done!" />
    );
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <sl-dialog
          class="dialog"
        >
          <div
            class="body"
          >
            <div
              class="icon success"
            >
              <icons.antd-icon />
            </div>
            <div>
              <div>
                Done!
              </div>
            </div>
          </div>
          <basic.general-button
            slot="footer"
          >
            Ok
          </basic.general-button>
        </sl-dialog>
      </DocumentFragment>
    `);
    expect(container.querySelector("sl-dialog")).toHaveProperty(
      "label",
      "Dialog"
    );
    expect(container.querySelector("icons\\.antd-icon")).toHaveProperty(
      "icon",
      "check-circle"
    );
    const event = new Event("sl-request-close");
    const preventDefault = jest.spyOn(event, "preventDefault");
    fireEvent(container.querySelector("sl-dialog") as any, event);
    expect(preventDefault).toBeCalled();
    unmount();
  });

  test("type confirm", () => {
    const onCancel = jest.fn();
    const { asFragment, container, unmount } = render(
      <DialogComponent
        type="confirm"
        content="Are you sure?"
        onCancel={onCancel}
      />
    );
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <sl-dialog
          class="dialog"
        >
          <div
            class="body"
          >
            <div
              class="icon warning"
            >
              <icons.antd-icon />
            </div>
            <div>
              <div>
                Are you sure?
              </div>
            </div>
          </div>
          <basic.general-button
            slot="footer"
          >
            Cancel
          </basic.general-button>
          <basic.general-button
            slot="footer"
          >
            Ok
          </basic.general-button>
        </sl-dialog>
      </DocumentFragment>
    `);
    expect(container.querySelector("icons\\.antd-icon")).toHaveProperty(
      "icon",
      "exclamation-circle"
    );
    fireEvent.click(container.querySelector("basic\\.general-button") as any);
    expect(onCancel).toBeCalled();
    unmount();
  });

  test("type error", () => {
    const { asFragment, container, unmount } = render(
      <DialogComponent type="error" title="Error" content="Oops!" />
    );
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <sl-dialog
          class="dialog"
        >
          <div
            class="body"
          >
            <div
              class="icon danger"
            >
              <icons.antd-icon />
            </div>
            <div>
              <div
                class="contentTitle"
              >
                Error
              </div>
              <div>
                Oops!
              </div>
            </div>
          </div>
          <basic.general-button
            slot="footer"
          >
            Ok
          </basic.general-button>
        </sl-dialog>
      </DocumentFragment>
    `);
    expect(container.querySelector("sl-dialog")).toHaveProperty(
      "label",
      "Error"
    );
    expect(container.querySelector("icons\\.antd-icon")).toHaveProperty(
      "icon",
      "close-circle"
    );
    unmount();
  });

  test("type info", () => {
    const { container, unmount } = render(
      <DialogComponent type="info" content="Hi!" />
    );
    expect(container.querySelector("icons\\.antd-icon")).toHaveProperty(
      "icon",
      "info-circle"
    );
    expect(
      (
        container.querySelector("icons\\.antd-icon") as any
      ).parentElement.classList.contains("primary")
    ).toBe(true);
    unmount();
  });

  test("type warn", () => {
    const { container, unmount } = render(
      <DialogComponent type="warn" content="Ouch!" />
    );
    expect(container.querySelector("icons\\.antd-icon")).toHaveProperty(
      "icon",
      "exclamation-circle"
    );
    expect(
      (
        container.querySelector("icons\\.antd-icon") as any
      ).parentElement.classList.contains("warning")
    ).toBe(true);
    unmount();
  });
});
