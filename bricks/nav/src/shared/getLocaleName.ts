import { i18nText } from "@next-core/i18n";
import type { AppLocales, I18nData } from "@next-core/types";

export function getAppLocaleName(
  locales: AppLocales | undefined,
  name: string
) {
  if (!locales) {
    return name;
  }
  const i18nData = Object.fromEntries(
    Object.entries(locales)
      .filter(([lang, resources]) => resources.name)
      .map(([lang, resources]) => [lang, resources.name])
  ) as I18nData;
  return i18nText(i18nData) ?? name;
}
