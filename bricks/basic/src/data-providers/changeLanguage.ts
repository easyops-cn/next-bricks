import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";

export function changeLanguage(lang: string): boolean {
  i18n.changeLanguage(lang);
  return true;
}

customElements.define(
  "basic.change-language",
  createProviderClass(changeLanguage)
);
