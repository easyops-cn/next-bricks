import { i18n } from "@next-core/i18n";

export enum K {
  CLICK_TO_FIX_NAVIGATION = "CLICK_TO_FIX_NAVIGATION",
  UNPIN_NAVIGATION = "UNPIN_NAVIGATION",
  FIXED_NAVIGATION = "FIXED_NAVIGATION",
}

const en: Locale = {
  UNPIN_NAVIGATION: "Unpin navigation",
  FIXED_NAVIGATION: "Fixed navigation",
  CLICK_TO_FIX_NAVIGATION: "Click to {{action}}",
};

const zh: Locale = {
  UNPIN_NAVIGATION: "取消固定",
  FIXED_NAVIGATION: "固定导航",
  CLICK_TO_FIX_NAVIGATION: "点击{{action}}",
};

export const NS = "bricks/nav/eo-sidebar";

export const locales = { en, zh };

export const t = i18n.getFixedT(null, NS);

type Locale = { [key in K]: string };
