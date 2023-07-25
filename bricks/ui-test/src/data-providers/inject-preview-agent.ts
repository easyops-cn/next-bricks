import { createProviderClass } from "@next-core/utils/general";

let injected = false;

const EVENTS = ["click", "dblclick", "keydown", "change"] as const;
let recordEnabled = false;

export async function injectPreviewAgent(
  previewFromOrigin: string,
  previewOptions?: unknown
): Promise<unknown> {
  if (injected) {
    return;
  }
  injected = true;

  const sendMessage = (message: any): void => {
    window.parent.postMessage(
      {
        channel: "ui-test-preview",
        ...message,
      },
      previewFromOrigin
    );
  };

  sendMessage({ type: "initialized" });

  window.addEventListener("message", (e) => {
    if (e.data?.channel === "ui-test-preview") {
      switch (e.data.type) {
        case "toggle-record":
          toggleRecord(e.data.payload.recordEnabled);
          break;
      }
    }
  });
}

function onClick(e: Event) {
  // eslint-disable-next-line no-console
  console.log(e.type, e);
  if (e.type === "click") {
    for (const item of e.composedPath()) {
      if (
        (item as Node).nodeType === Node.ELEMENT_NODE &&
        item instanceof HTMLElement &&
        item.dataset.testid
      ) {
        // eslint-disable-next-line no-console
        console.log("found brick:", item);
      }
    }
  }
}

function toggleRecord(enabled: boolean) {
  if (recordEnabled !== enabled) {
    recordEnabled = enabled;
    (recordEnabled ? startRecord : stopRecord)();
  }
}

function startRecord() {
  for (const type of EVENTS) {
    document.addEventListener(type, onClick, {
      capture: true,
      passive: true,
    });
  }
}

function stopRecord() {
  for (const type of EVENTS) {
    document.removeEventListener(type, onClick, { capture: true });
  }
}

customElements.define(
  "ui-test.inject-preview-agent",
  createProviderClass(injectPreviewAgent)
);
