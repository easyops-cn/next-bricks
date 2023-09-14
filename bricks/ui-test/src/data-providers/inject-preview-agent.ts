// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import { getHistory } from "@next-core/runtime";
import {
  hoverOverTreeNode,
  setActiveTreeNode,
  setPreviewFromOrigin,
  toggleInspecting,
} from "./preview/inspector.js";
import { toggleRecording } from "./preview/recorder.js";

let injected = false;
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

  let inspecting = false;
  window.addEventListener("message", (e) => {
    if (e.data?.channel === "ui-test-preview") {
      switch (e.data.type) {
        case "toggle-record":
          toggleRecording(e.data.payload.recording, inspecting);
          break;
        case "toggle-inspecting":
          toggleInspecting((inspecting = e.data.payload.inspecting));
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
        case "hover-over-tree-node":
          hoverOverTreeNode(e.data.payload.relatedCommands);
          break;
        case "set-active-tree-node":
          setActiveTreeNode(e.data.payload.relatedCommands);
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

customElements.define(
  "ui-test.inject-preview-agent",
  createProviderClass(injectPreviewAgent)
);
