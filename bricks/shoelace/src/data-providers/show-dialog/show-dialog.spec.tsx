import React from "react";
import { describe, test, expect } from "@jest/globals";
import { waitFor, act, render, fireEvent } from "@testing-library/react";
import { showDialog, DialogComponent } from "./show-dialog.js";

// <sl-dialog> uses those API which is not supported in jsdom.
Element.prototype.getAnimations = jest.fn().mockReturnValue([]);
Element.prototype.animate = jest.fn().mockReturnValue({
  addEventListener: jest.fn(),
});

describe("showDialog", () => {
  test("general", async () => {
    let promise: Promise<void> | undefined;
    act(() => {
      promise = showDialog({
        content: "Tips",
      });
    });
    await waitFor(() =>
      expect(document.querySelector("sl-button")).not.toBeNull()
    );
    expect(document.body.childNodes.length).toBe(1);
    await act(async () => {
      document.querySelector("sl-button")?.click();
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
              <sl-icon />
            </div>
            <div>
              <div>
                Done!
              </div>
            </div>
          </div>
          <sl-button
            slot="footer"
          >
            Ok
          </sl-button>
        </sl-dialog>
      </DocumentFragment>
    `);
    expect(container.querySelector("sl-dialog")).toHaveProperty(
      "label",
      "Dialog"
    );
    expect(container.querySelector("sl-icon")).toHaveProperty(
      "name",
      "check2-circle"
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
      <DialogComponent type="confirm" content="Are you sure?" onCancel={onCancel} />
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
              <sl-icon />
            </div>
            <div>
              <div>
                Are you sure?
              </div>
            </div>
          </div>
          <sl-button
            slot="footer"
          >
            Cancel
          </sl-button>
          <sl-button
            slot="footer"
          >
            Ok
          </sl-button>
        </sl-dialog>
      </DocumentFragment>
    `);
    expect(container.querySelector("sl-icon")).toHaveProperty(
      "name",
      "exclamation-triangle"
    );
    fireEvent.click(container.querySelector("sl-button") as any);
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
              <sl-icon />
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
          <sl-button
            slot="footer"
          >
            Ok
          </sl-button>
        </sl-dialog>
      </DocumentFragment>
    `);
    expect(container.querySelector("sl-dialog")).toHaveProperty(
      "label",
      "Error"
    );
    expect(container.querySelector("sl-icon")).toHaveProperty(
      "name",
      "exclamation-octagon"
    );
    unmount();
  });

  test("type info", () => {
    const { container, unmount } = render(
      <DialogComponent type="info" content="Hi!" />
    );
    expect(container.querySelector("sl-icon")).toHaveProperty(
      "name",
      "info-circle"
    );
    expect((container.querySelector("sl-icon") as any).parentElement.classList.contains("primary")).toBe(true);
    unmount();
  });

  test("type warn", () => {
    const { container, unmount } = render(
      <DialogComponent type="warn" content="Ouch!" />
    );
    expect(container.querySelector("sl-icon")).toHaveProperty(
      "name",
      "exclamation-triangle"
    );
    expect((container.querySelector("sl-icon") as any).parentElement.classList.contains("warning")).toBe(true);
    unmount();
  });
});
