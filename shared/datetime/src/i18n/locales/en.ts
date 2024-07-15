import { Locale, K } from "../constants.js";

const locale: Locale = {
  [K.YESTERDAY]: "Yesterday",
  [K.TODAY]: "Today",
  [K.FUTURE_AFTER]: "After {{time}}",
  [K.FORMAT_MEDIUM_DATETIME]: "LLL",
  [K.FORMAT_MEDIUM_DATE]: "LL",
  [K.FORMAT_SHORT_DATETIME]: "MMM D ah:mm",
  [K.FORMAT_SHORT_DATE]: "MMM D",
  [K.FORMAT_SHORT_DAY_DATETIME]: "MMM D HH:mm",
  [K.FORMAT_SHORT_DAY_DATE]: "MMM D",
  [K.MONTHS]: "months",
  [K.HOURS]: "hours",
  [K.SECONDS]: "seconds",
  [K.MILL_SECONDS]: "millseconds",
  [K.DAYS]: "days",
  [K.MINUTES]: "minutes",
};

export default locale;
