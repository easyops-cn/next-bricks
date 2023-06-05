import { i18n } from "@next-core/i18n";
import { NS_BASIC } from "./constants.js";
import en from "./locales/en.js";
import zh from "./locales/zh.js";

i18n.addResourceBundle("en", NS_BASIC, en);
i18n.addResourceBundle("zh", NS_BASIC, zh);
