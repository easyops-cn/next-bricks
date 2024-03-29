export enum K {}
// HELLO = "HELLO",

const en: Locale = {
  // HELLO: "Hello",
};

const zh: Locale = {
  // HELLO: "你好",
};

export const NS = "bricks/basic/eo-menu-group";

export const locales = { en, zh };

type Locale = { [key in K]: string };
