// Merge bricks
// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import connect from "./preview/connect.js";
import type { PreviewStartOptions } from "./preview/interfaces.js";
// Todo: remove unnecessary provider below
import "./collect-used-contracts.js";

export function injectPreviewAgent(
  previewFromOrigin: string,
  options: PreviewStartOptions
): Promise<unknown> {
  return connect(previewFromOrigin, options);
}

/**
 * 已废弃，因为如果从 IDE 环境注入到预览环境，会导致预览环境的 bricks/visual-builder 被 IDE 环境覆盖，
 * 这可能导致：
 *   - 预览环境无法使用本地的 bricks/visual-builder 中的新构件。
 *
 * @deprecated Use `inject.visual-builder-preview-agent` instead
 */
customElements.define(
  "visual-builder.inject-preview-agent",
  createProviderClass(injectPreviewAgent)
);
