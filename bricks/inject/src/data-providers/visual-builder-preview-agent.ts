// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import connect from "./visual-builder-preview/connect.js";
import type { PreviewStartOptions } from "./visual-builder-preview/interfaces.js";

export async function visualBuilderPreviewAgent(
  previewFromOrigin: string,
  options: PreviewStartOptions
): Promise<unknown> {
  return connect(previewFromOrigin, options);
}

customElements.define(
  "inject.visual-builder-preview-agent",
  createProviderClass(visualBuilderPreviewAgent)
);
