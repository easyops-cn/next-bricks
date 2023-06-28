import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";

/**
 * 更改站点语言。
 *
 * @param lang 语言
 */
export async function changeLanguage(lang: string): Promise<void> {
  await i18n.changeLanguage(lang);
}

customElements.define(
  "basic.change-language",
  createProviderClass(changeLanguage)
);
