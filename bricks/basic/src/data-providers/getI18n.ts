import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";

export function getI18n() {
  return {
    changeLanguage: i18n.changeLanguage,
    lang: i18n.language,
  };
}

customElements.define("basic.get-i18n", createProviderClass(getI18n));
