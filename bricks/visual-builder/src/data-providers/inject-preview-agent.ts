// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import connect from "./preview/connect.js";
import type { PreviewStartOptions } from "./preview/interfaces.js";

export function injectPreviewAgent(
  previewFromOrigin: string,
  options: PreviewStartOptions
): Promise<unknown> {
  return connect(previewFromOrigin, options);
}

customElements.define(
  "visual-builder.inject-preview-agent",
  createProviderClass(injectPreviewAgent)
);
