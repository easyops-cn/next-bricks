export enum K {
  NEXT_DAY = "NEXT_DAY",
  TODAY = "TODAY",
  LAST_DAY = "LAST_DAY",
  NEXT_WEEK = "NEXT_WEEK",
  THIS_WEEK = "THIS_WEEK",
  LAST_WEEK = "LAST_WEEK",
  NEXT_MONTH = "NEXT_MONTH",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
  NEXT_QUARTER = "NEXT_QUARTER",
  THIS_QUARTER = "THIS_QUARTER",
  LAST_QUARTER = "LAST_QUARTER",
  NEXT_YEAR = "NEXT_YEAR",
  THIS_YEAR = "THIS_YEAR",
  LAST_YEAR = "LAST_YEAR",
  FISRT_QUARTER = "FISRT_QUARTER",
  SECOND_QUARTER = "SECOND_QUARTER",
  THIRD_QUARTER = "THIRD_QUARTER",
  FOURTH_QUARTER = "FOURTH_QUARTER",
}

const en: Locale = {
  NEXT_DAY: "Next day",
  TODAY: "Today",
  LAST_DAY: "Previous day",
  NEXT_WEEK: "Next week",
  THIS_WEEK: "This week",
  LAST_WEEK: "Previous week",
  NEXT_MONTH: "Next month",
  THIS_MONTH: "This month",
  LAST_MONTH: "Previous month",
  NEXT_QUARTER: "Next quarter",
  THIS_QUARTER: "This quarter",
  LAST_QUARTER: "Previous quarter",
  NEXT_YEAR: "Next year",
  THIS_YEAR: "This year",
  LAST_YEAR: "Previous year",
  FISRT_QUARTER: "First quarter",
  SECOND_QUARTER: "Second quarter",
  THIRD_QUARTER: "Third quarter",
  FOURTH_QUARTER: "Fourth quarter",
};

const zh: Locale = {
  NEXT_DAY: "下日",
  TODAY: "今日",
  LAST_DAY: "上日",
  NEXT_WEEK: "下周",
  THIS_WEEK: "本周",
  LAST_WEEK: "上周",
  NEXT_MONTH: "下月",
  THIS_MONTH: "本月",
  LAST_MONTH: "上月",
  NEXT_QUARTER: "下季度",
  THIS_QUARTER: "本季度",
  LAST_QUARTER: "上季度",
  NEXT_YEAR: "下年",
  THIS_YEAR: "今年",
  LAST_YEAR: "上年",
  FISRT_QUARTER: "第一季度",
  SECOND_QUARTER: "第二季度",
  THIRD_QUARTER: "第三季度",
  FOURTH_QUARTER: "第四季度",
};

export const NS = "bricks/form/eo-date-picker";

export const locales = { en, zh };

type Locale = { [key in K]: string };
