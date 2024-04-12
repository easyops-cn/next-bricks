export enum K {}

const en: Locale = {};

const zh: Locale = {};

export const NS = "bricks/advanced/eo-table";

export const locales = { en, zh };

type Locale = { [k in K]: string };
