export enum K {
    EMPTY_DATA = "EMPTY_DATA",
}

const en: Locale = {
    EMPTY_DATA: "Empty data",
};

const zh: Locale = {
    EMPTY_DATA: "空数据",
};

export const NS = "bricks/data-view/complex-search";

export const locales = { en, zh };

type Locale = { [key in K]: string };
