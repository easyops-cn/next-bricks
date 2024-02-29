export enum K {
  CONTRACT_OPTIONS_TIPS_PREFIX = "CONTRACT_OPTIONS_TIPS_PREFIX",
  CONTRACT_OPTIONS_TIPS_SUFFIX = "CONTRACT_OPTIONS_TIPS_SUFFIX",
  CONTRACT_VALIDATE_MESSAGE = "CONTRACT_VALIDATE_MESSAGE",
}

const en: Locale = {
  CONTRACT_OPTIONS_TIPS_PREFIX: "Only the first",
  CONTRACT_OPTIONS_TIPS_SUFFIX:
    "items are displayed, please search for more results",
  CONTRACT_VALIDATE_MESSAGE: "Please fill in the correct contract name ",
};

const zh: Locale = {
  CONTRACT_OPTIONS_TIPS_PREFIX: "仅展示前",
  CONTRACT_OPTIONS_TIPS_SUFFIX: "项,更多结果请搜索",
  CONTRACT_VALIDATE_MESSAGE: "请填写正确的契约名称",
};

export const NS = "bricks/visual-builder/contract-select";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
