import { isNil, findIndex, chain } from "lodash";
import moment from "moment";
import { NS_LIBS_DATETIME, K } from "./i18n/constants.js";
import { i18n } from "@next-core/i18n";
export const costTime = (cost: number, start?: any, end?: any) => {
  // 某些后台接口任务初始时 `end` 为 "0001-01-01T00:00:00Z"
  if (isNil(cost) && (isNil(end) || end === "0001-01-01T00:00:00Z")) {
    return "";
  }

  if (isNil(cost)) {
    cost = moment(end).diff(start);
  }

  cost = Math.max(cost, 0);

  const milliseconds = cost % 1000;
  const seconds = Math.floor(cost / 1000) % 60;
  const minutes = Math.floor(cost / 60000) % 60;
  const hours = Math.floor(cost / 3600000) % 24;
  const days = Math.floor(cost / 86400000) % 30;
  const months = Math.floor(cost / (86400000 * 30));

  const list = [
    {
      count: months,
      unit: i18n.t(`${NS_LIBS_DATETIME}:${K.MONTHS}`),
    },
    {
      count: days,
      unit: i18n.t(`${NS_LIBS_DATETIME}:${K.DAYS}`),
    },
    {
      count: hours,
      unit: i18n.t(`${NS_LIBS_DATETIME}:${K.HOURS}`),
    },
    {
      count: minutes,
      unit: i18n.t(`${NS_LIBS_DATETIME}:${K.MINUTES}`),
    },
    {
      count: seconds,
      unit: i18n.t(`${NS_LIBS_DATETIME}:${K.SECONDS}`),
    },
    {
      count: milliseconds,
      unit: i18n.t(`${NS_LIBS_DATETIME}:${K.MILL_SECONDS}`),
    },
  ];

  const index = findIndex(list, function (item) {
    return item.count > 0;
  });

  // 如果小于 1 分钟，统一只显示 `秒`
  if (index >= 4 || index === -1) {
    // 如果小于 0.1 秒，取 3 位小数，否则取 1 位小数
    return (
      +(cost / 1000).toFixed(cost >= 100 ? 1 : 3) +
      " " +
      i18n.t(`${NS_LIBS_DATETIME}:${K.SECONDS}`)
    );
  }
  // 否则，统一显示为最大的两个且不为 0 的单位
  return chain(list.slice(index, index + 2))
    .filter(function (item) {
      return item.count > 0;
    })
    .map(function (item) {
      return item.count + " " + item.unit;
    })
    .value()
    .join(" ");
};
