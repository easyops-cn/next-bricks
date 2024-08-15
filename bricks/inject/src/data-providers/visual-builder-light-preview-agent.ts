import { createProviderClass } from "@next-core/utils/general";

let connected = false;

export interface PreviewStartOptions {
  appId: string;
}

export async function visualBuilderLightPreviewAgent(
  previewFromOrigin: string,
  options: PreviewStartOptions
) {
  if (connected) {
    return;
  }
  connected = true;
  // eslint-disable-next-line no-console
  console.log(previewFromOrigin, options);
}

customElements.define(
  "inject.visual-builder-light-preview-agent",
  createProviderClass(visualBuilderLightPreviewAgent)
);
