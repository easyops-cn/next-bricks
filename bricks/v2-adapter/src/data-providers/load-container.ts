import { createRuntime } from "@next-core/runtime";
import { createProviderClass } from "@next-core/utils/general";

export async function loadContainer(): Promise<void> {
  await import("@next-core/theme/global.css");
  createRuntime();
}

customElements.define(
  "v2-adapter.load-container",
  createProviderClass(loadContainer)
);
