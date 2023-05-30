import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";

export async function changeLanguage(lang: string): Promise<boolean> {
  await i18n.changeLanguage(lang);
  return true;
}

customElements.define(
  "basic.change-language",
  createProviderClass(changeLanguage)
);
