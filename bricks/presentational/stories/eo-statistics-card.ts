import { eoStatisticCardSvg } from "./images";

export const eoStatisticsCardStory = {
  storyId: "eo-statistics-card",
  text: {
    en: "Statistic Card",
    zh: "统计卡片",
  },
  description: {
    en: "Card showing statistics, usually used on the homepage",
    zh: "展示统计数据的卡片，一般在首页使用",
  },
  icon: {
    lib: "fa",
    icon: "info",
  },
  conf: [
    {
      snippetId: "eo-statistics-card[normal]",
      title: {
        zh: "基础统计卡片",
        en: "",
      },
      thumbnail: eoStatisticCardSvg,
      bricks: [
        {
          brick: "eo-statistics-card",
          properties: {
            cardTitle: "今日构建",
            value: 99,
            icon: {
              lib: "fa",
              icon: "clock",
            },
          },
        },
      ],
    },
  ],
};
