export enum K {}

const en: Locale = {};

const zh: Locale = {};

export const NS = "bricks/visual-builder/generate-snippets-context-menu";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
