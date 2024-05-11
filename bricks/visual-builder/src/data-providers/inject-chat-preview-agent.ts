import { createProviderClass } from "@next-core/utils/general";
import { select, toggleInspecting } from "./chat-preview/inspector";

let injected = false;

export async function injectChatPreviewAgent(): Promise<unknown> {
  if (injected) {
    return;
  }
  injected = true;
  import("./chat-preview/styles.css");

  sendMessage({ type: "initialized" });

  window.addEventListener("message", (e) => {
    if (e.data?.channel === "chat-preview") {
      switch (e.data.type) {
        case "toggle-inspecting":
          toggleInspecting(e.data.payload.inspecting);
          break;
        case "select":
          select(e.data.payload);
          break;
      }
    }
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

function sendMessage(message: object) {
  window.parent.postMessage(
    {
      channel: "chat-preview",
      ...message,
    },
    location.origin
  );
}

customElements.define(
  "visual-builder.inject-chat-preview-agent",
  createProviderClass(injectChatPreviewAgent)
);
