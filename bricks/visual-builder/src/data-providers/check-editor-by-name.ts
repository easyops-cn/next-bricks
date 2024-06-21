import { __secret_internals, customEditors } from "@next-core/runtime";
import { createProviderClass } from "@next-core/utils/general";

export async function checkEditorByName(name: string): Promise<boolean> {
  try {
    await __secret_internals.loadEditors([name]);
  } catch {
    return false;
  }
  const editor = customEditors.get(name);

  return !!editor;
}

customElements.define(
  "visual-builder.check-editor-by-name",
  createProviderClass(checkEditorByName)
);
