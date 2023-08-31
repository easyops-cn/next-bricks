// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import { getHistory } from "@next-core/runtime";
import { setPreviewFromOrigin, toggleInspecting } from "./preview/inspector.js";

let injected = false;

const EVENTS = ["click", "dblclick", "keydown"] as const;
let recording = false;

const history = getHistory();

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
  setPreviewFromOrigin(previewFromOrigin);

  window.addEventListener("message", (e) => {
    if (e.data?.channel === "ui-test-preview") {
      switch (e.data.type) {
        case "toggle-record":
          toggleRecording(e.data.payload.recording);
          break;
        case "toggle-inspecting":
          toggleInspecting(e.data.payload.inspecting);
          break;
        case "reload":
          location.reload();
          break;
        case "back":
          history.goBack();
          break;
        case "forward":
          history.goForward();
          break;
      }
    }
  });

  history.listen((loc) => {
    sendMessage({
      type: "url-change",
      payload: {
        url: location.origin + history.createHref(loc),
      },
    });
  });

  window.addEventListener("scroll", () => {
    sendMessage({
      type: "scroll",
      payload: {
        x: window.scrollX,
        y: window.scrollY,
      },
    });
  });
}

function onClick(e: Event) {
  // eslint-disable-next-line no-console
  console.log(e.type, e);
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

function toggleRecording(enabled: boolean) {
  if (recording !== enabled) {
    recording = enabled;
    (recording ? startRecord : stopRecord)();
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
