import { initializeI18n } from "@next-core/i18n";
import { NS_LIBS_DATETIME } from "./constants.js";
import en from "./locales/en.js";
import zh from "./locales/zh.js";

export function addResourceBundle(): void {
  initializeI18n(NS_LIBS_DATETIME, { en, zh });
}
