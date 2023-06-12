import { createProviderClass } from "@next-core/utils/general";

export async function getEasyopsIcons(): Promise<Record<string, string[]>> {
  return (await import("../easyops-icon/generated/icons.json")).default;
}

export async function getFaIcons(): Promise<Record<string, string[]>> {
  return (await import("../fa-icon/generated/icons.json")).default;
}

export async function getAntdIcons(): Promise<Record<string, string[]>> {
  return (await import("../antd-icon/generated/icons.json")).default;
}

customElements.define(
  "icons.get-easyops-icons",
  createProviderClass(getEasyopsIcons)
);

customElements.define("icons.get-fa-icons", createProviderClass(getFaIcons));

customElements.define(
  "icons.get-antd-icons",
  createProviderClass(getAntdIcons)
);
