import { Locale, K } from "../constants.js";

const locale: Locale = {
  [K.YESTERDAY]: "昨天",
  [K.TODAY]: "今天",
  [K.FUTURE_AFTER]: "{{time}}后",
  [K.FORMAT_MEDIUM_DATETIME]: "LL ah:mm",
  [K.FORMAT_MEDIUM_DATE]: "LL",
  [K.FORMAT_SHORT_DATETIME]: "MMMD日 ah:mm",
  [K.FORMAT_SHORT_DATE]: "MMMD日",
  [K.FORMAT_SHORT_DAY_DATETIME]: "MMMD日 HH:mm",
  [K.FORMAT_SHORT_DAY_DATE]: "MMMD日",
  [K.MONTHS]: "个月",
  [K.HOURS]: "小时",
  [K.SECONDS]: "秒",
  [K.MILL_SECONDS]: "毫秒",
  [K.DAYS]: "天",
  [K.MINUTES]: "分钟",
};

export default locale;
