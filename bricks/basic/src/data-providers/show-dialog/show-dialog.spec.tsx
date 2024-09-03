import React from "react";
import { describe, test, expect } from "@jest/globals";
import { waitFor, act, render, fireEvent } from "@testing-library/react";
import { showDialog, DialogComponent } from "./show-dialog.js";

jest.mock("@next-core/theme", () => ({}));

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
  "eo-button",
  class HTMLGeneralButtonElement extends HTMLElement {
    type: string | undefined;
  }
);

customElements.define(
  "eo-antd-icon",
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
      expect(document.querySelector("eo-button")).not.toBeNull()
    );
    expect(document.body.childNodes.length).toBe(1);
    await act(async () => {
      (document.querySelector("eo-button") as HTMLElement)?.click();
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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
        <div>
          Done!
        </div>
      </div>
    </div>
    <eo-button
      slot="footer"
    >
      Ok
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);
    expect(container.querySelector("sl-dialog")).toHaveProperty(
      "label",
      "Dialog"
    );
    expect(container.querySelector("eo-antd-icon")).toHaveProperty(
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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
        <div>
          Are you sure?
        </div>
      </div>
    </div>
    <eo-button
      slot="footer"
    >
      Cancel
    </eo-button>
    <eo-button
      slot="footer"
    >
      Ok
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);
    expect(container.querySelector("eo-antd-icon")).toHaveProperty(
      "icon",
      "exclamation-circle"
    );
    fireEvent.click(container.querySelector("eo-button") as any);
    expect(onCancel).toBeCalled();
    unmount();
  });

  test("type delete", () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    const { asFragment, container, unmount } = render(
      <DialogComponent
        type="delete"
        content="Are you sure?"
        onCancel={onCancel}
        onOk={onOk}
        expect="confirm delete"
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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
        <div>
          Are you sure?
        </div>
        <eo-input
          auto-focus=""
          class="expectInput"
        />
      </div>
    </div>
    <eo-button
      slot="footer"
    >
      Cancel
    </eo-button>
    <eo-button
      danger=""
      disabled=""
      slot="footer"
    >
      Delete
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);
    expect(container.querySelector("eo-antd-icon")).toHaveProperty(
      "icon",
      "exclamation-circle"
    );
    fireEvent.click(container.querySelectorAll("eo-button")[0]);
    expect(onCancel).toBeCalled();

    fireEvent.click(container.querySelectorAll("eo-button")[1]);
    expect(onOk).not.toBeCalled();

    act(() => {
      fireEvent(
        container.querySelector("eo-input") as HTMLElement,
        new CustomEvent("change", { detail: "confirm delete" })
      );
    });
    act(() => {
      fireEvent.click(container.querySelectorAll("eo-button")[1]);
    });
    expect(onOk).toBeCalled();

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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
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
    <eo-button
      slot="footer"
    >
      Ok
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);
    expect(container.querySelector("sl-dialog")).toHaveProperty(
      "label",
      "Error"
    );
    expect(container.querySelector("eo-antd-icon")).toHaveProperty(
      "icon",
      "close-circle"
    );
    unmount();
  });

  test("type info", () => {
    const { container, unmount } = render(
      <DialogComponent type="info" content="Hi!" />
    );
    expect(container.querySelector("eo-antd-icon")).toHaveProperty(
      "icon",
      "info-circle"
    );
    expect(
      (
        container.querySelector("eo-antd-icon") as any
      ).parentElement.classList.contains("primary")
    ).toBe(true);
    unmount();
  });

  test("type warn", () => {
    const { container, unmount } = render(
      <DialogComponent type="warn" content="Ouch!" />
    );
    expect(container.querySelector("eo-antd-icon")).toHaveProperty(
      "icon",
      "exclamation-circle"
    );
    expect(
      (
        container.querySelector("eo-antd-icon") as any
      ).parentElement.classList.contains("warning")
    ).toBe(true);
    unmount();
  });

  test("content template", () => {
    const { asFragment, unmount, rerender } = render(
      <DialogComponent
        type="delete"
        content="Please enter {{ expect }} to delete the file."
        expect="cat.png"
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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
        <div>
          Please enter 
          <strong
            class="strong"
          >
            cat.png
          </strong>
           to delete the file.
        </div>
        <eo-input
          auto-focus=""
          class="expectInput"
        />
      </div>
    </div>
    <eo-button
      slot="footer"
    >
      Cancel
    </eo-button>
    <eo-button
      danger=""
      disabled=""
      slot="footer"
    >
      Delete
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);

    rerender(
      <DialogComponent
        type="delete"
        content="{{ expect }} Please enter {{ expect }} to delete the file. {{ expect }}"
        expect="cat.png"
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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
        <div>
          <strong
            class="strong"
          >
            cat.png
          </strong>
           Please enter 
          <strong
            class="strong"
          >
            cat.png
          </strong>
           to delete the file. 
          <strong
            class="strong"
          >
            cat.png
          </strong>
        </div>
        <eo-input
          auto-focus=""
          class="expectInput"
        />
      </div>
    </div>
    <eo-button
      slot="footer"
    >
      Cancel
    </eo-button>
    <eo-button
      danger=""
      disabled=""
      slot="footer"
    >
      Delete
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);

    rerender(
      <DialogComponent
        type="delete"
        content="Please enter {{ unknown }} to delete the file."
        expect="cat.png"
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
        <eo-antd-icon />
      </div>
      <div
        class="content"
      >
        <div>
          Please enter  to delete the file.
        </div>
        <eo-input
          auto-focus=""
          class="expectInput"
        />
      </div>
    </div>
    <eo-button
      slot="footer"
    >
      Cancel
    </eo-button>
    <eo-button
      danger=""
      disabled=""
      slot="footer"
    >
      Delete
    </eo-button>
  </sl-dialog>
</DocumentFragment>
`);

    unmount();
  });
});
