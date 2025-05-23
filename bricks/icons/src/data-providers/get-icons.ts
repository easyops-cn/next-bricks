import { createProviderClass } from "@next-core/utils/general";
import antdIcons from "../antd-icon/generated/icons.json";
import easyopsIcons from "../easyops-icon/generated/icons.json";
import faIcons from "../fa-icon/generated/icons.json";

export async function getEasyopsIcons(): Promise<Record<string, string[]>> {
  return easyopsIcons;
}

export async function getFaIcons(): Promise<Record<string, string[]>> {
  return faIcons;
}

export async function getAntdIcons(): Promise<Record<string, string[]>> {
  return antdIcons;
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
