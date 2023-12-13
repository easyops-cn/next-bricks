import { eoCategoryNormalSvg, eoCategorySvg } from "./images";

export const eoCategoryStory = {
  storyId: "eo-category",
  text: {
    en: "information-category-container",
    zh: "信息分类容器",
  },
  description: {
    en: "Grouping of complex information",
    zh: "对复杂信息进行分组",
  },
  icon: {
    imgSrc: eoCategorySvg,
  },
  conf: [
    {
      snippetId: "eo-category[normal]",
      title: {
        en: "Basic information category container",
        zh: "基本信息分类",
      },
      thumbnail: eoCategoryNormalSvg,
      bricks: [
        {
          brick: "eo-category",
          properties: {
            categories: [
              {
                title: "分类一",
                key: "category1",
              },
              {
                title: "分类二",
                key: "category2",
              },
            ],
          },
          slots: {
            category1: {
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "content1",
                  },
                },
              ],
              type: "bricks",
            },
            category2: {
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "content1",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
    },
  ],
};
