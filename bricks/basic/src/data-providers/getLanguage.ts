import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";

export function getLanguage(): string {
  return i18n.language;
}

customElements.define("basic.get-language", createProviderClass(getLanguage));
