export enum K {}
// HELLO = "HELLO",

const en: Locale = {
  // HELLO: "Hello",
};

const zh: Locale = {
  // HELLO: "你好",
};

export const NS = "bricks/nav/eo-sidebar-sub-menu";

export const locales = { en, zh };

type Locale = { [key in K]: string };
