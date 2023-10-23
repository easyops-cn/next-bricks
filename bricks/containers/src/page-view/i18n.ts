export enum K {}
// HELLO = "HELLO",

const en: Locale = {
  // HELLO: "Hello",
};

const zh: Locale = {
  // HELLO: "你好",
};

export const NS = "bricks/containers/eo-page-view";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
