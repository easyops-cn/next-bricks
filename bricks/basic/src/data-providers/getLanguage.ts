import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";

/**
 * 获取当前站点语言。
 *
 * @returns 当前语言
 */
export function getLanguage(): string {
  return i18n.language;
}

customElements.define("basic.get-language", createProviderClass(getLanguage));
