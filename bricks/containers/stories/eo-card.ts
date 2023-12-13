import { eoCardExtraSvg, eoCardSvg, eoCardTitleSuffixSvg } from "./images";

export const eoCardStory = {
  storyId: "eo-card",
  text: {
    en: "Card",
    zh: "通用卡片",
  },
  description: {
    en: "card",
    zh: "常见于为多个构件提供统一的卡片容器，比如将搜索框与表格放在一起",
  },
  icon: {
    imgSrc: eoCardSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-card",
          properties: {
            cardTitle: "卡片标题",
            hasExtraSlot: true,
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "内容",
                  },
                },
              ],
              type: "bricks",
            },
            extra: {
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    icon: {
                      lib: "antd",
                      icon: "plus",
                    },
                    shape: "circle",
                    type: "icon",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-card[extra]",
      title: {
        en: "Eo Card with Extra Slot",
        zh: "带extra插槽的通用卡片",
      },
      thumbnail: eoCardExtraSvg,
    },
    {
      bricks: [
        {
          brick: "eo-card",
          properties: {
            cardTitle: "标题",
          },
          slots: {
            "": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "内容",
                  },
                },
              ],
            },
            titleSuffix: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-tooltip",
                  properties: {
                    dataset: { testid: "basic-usage-demo" },
                    icon: {
                      lib: "fa",
                      icon: "info-circle",
                    },
                    content: "这是一个 tooltips",
                    trigger: "hover",
                  },
                  children: [
                    {
                      brick: "eo-icon",
                      properties: {
                        icon: "info",
                        lib: "antd",
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      snippetId: "eo-card[title-suffix]",
      title: {
        en: "Eo Card with Title Suffix Slot",
        zh: "带titleSuffix插槽的通用卡片",
      },
      thumbnail: eoCardTitleSuffixSvg,
    },
  ],
};
