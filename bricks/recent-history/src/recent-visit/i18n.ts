export enum K {
  RECENT_VISIT = "RECENT_VISIT",
}

const en: Locale = {
  RECENT_VISIT: "Recent visits",
};

const zh: Locale = {
  RECENT_VISIT: "最近访问",
};

export const NS = "bricks/recent-history/recent-visit";

export const locales = { en, zh };

type Locale = { [key in K]: string };
