/* istanbul ignore file */
export enum K {
  VIEW_DETAILS = "VIEW_DETAILS",
  DISMISS = "DISMISS",
}

const en: Locale = {
  VIEW_DETAILS: "View details",
  DISMISS: "Dismiss",
};

const zh: Locale = {
  VIEW_DETAILS: "查看详情",
  DISMISS: "忽略",
};

export const NS = "bricks/nav/poll-announce";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
