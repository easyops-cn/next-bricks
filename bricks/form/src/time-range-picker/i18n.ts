export enum K {
  TODAY = "TODAY",
  THIS_WEEK = "THIS_WEEK",
  THIS_MONTH = "THIS_MONTH",
  THIS_QUARTER = "THIS_QUARTER",
  THIS_YEAR = "THIS_YEAR",
  START_TIME_END_TIME_CANNOT_EQUAL = "START_TIME_END_TIME_CANNOT_EQUAL",
  START_TIME_REQUIRED = "START_TIME_REQUIRED",
  END_TIME_REQUIRED = "END_TIME_REQUIRED",
}
// HELLO = "HELLO",

const en: Locale = {
  TODAY: "Today",
  THIS_WEEK: "This Week",
  THIS_MONTH: "This Month",
  THIS_QUARTER: "This Quarter",
  THIS_YEAR: "This Year",
  START_TIME_END_TIME_CANNOT_EQUAL: "Start Time and End Time can NOT be equal",
  START_TIME_REQUIRED: "Start Time is required",
  END_TIME_REQUIRED: "End Time is required",
};

const zh: Locale = {
  TODAY: "今天",
  THIS_WEEK: "本周",
  THIS_MONTH: "本月",
  THIS_QUARTER: "本季度",
  THIS_YEAR: "今年",
  START_TIME_END_TIME_CANNOT_EQUAL: "开始时间和结束时间不能相等",
  START_TIME_REQUIRED: "开始时间必填",
  END_TIME_REQUIRED: "结束时间必填",
};

export const NS = "bricks/form/eo-time-range-picker";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
};
