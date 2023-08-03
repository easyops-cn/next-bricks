export enum K {
  UNIQUE = "UNIQUE",
}

const en: Locale = {
  UNIQUE: "{{ name }} can not repeat!",
};

const zh: Locale = {
  UNIQUE: "{{ name }} 不能重复！",
};

export const NS = "bricks/form/dynamic-form-item";

export const locales = { en, zh };

type Locale = { [key in K]: string };
