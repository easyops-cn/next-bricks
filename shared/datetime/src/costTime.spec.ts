import { costTime } from "./costTime.js";
import { NS_LIBS_DATETIME, K } from "./i18n/constants.js";
import { i18n } from "@next-core/i18n";
describe("costTime", () => {
  const testCases = [
    [null, undefined, undefined, ""],
    [undefined, undefined, "0001-01-01T00:00:00Z", ""],
    [
      21,
      undefined,
      undefined,
      "0.021 " + i18n.t(`${NS_LIBS_DATETIME}:${K.SECONDS}`),
    ],
    [
      210,
      undefined,
      undefined,
      "0.2 " + i18n.t(`${NS_LIBS_DATETIME}:${K.SECONDS}`),
    ],
    [
      1234,
      undefined,
      undefined,
      "1.2 " + i18n.t(`${NS_LIBS_DATETIME}:${K.SECONDS}`),
    ],
    [
      123456,
      undefined,
      undefined,
      "2 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.MINUTES}`) +
        " 3 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.SECONDS}`),
    ],
    [
      12345678,
      undefined,
      undefined,
      "3 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.HOURS}`) +
        " 25 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.MINUTES}`),
    ],
    [
      1234567890,
      undefined,
      undefined,
      "14 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.DAYS}`) +
        " 6 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.HOURS}`),
    ],
    [
      4403622000,
      undefined,
      undefined,
      "1 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.MONTHS}`) +
        " 20 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.DAYS}`),
    ],
    [
      undefined,
      "2018-01-02T03:04:05Z",
      "2018-01-02T13:14:15Z",
      "10 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.HOURS}`) +
        " 10 " +
        i18n.t(`${NS_LIBS_DATETIME}:${K.MINUTES}`),
    ],
  ];

  it.each(testCases)(
    "costTime(%s, %s, %s) should return '%s'",
    (cost, start, end, expected) => {
      expect(costTime(cost, start, end)).toBe(expected);
    }
  );
});
