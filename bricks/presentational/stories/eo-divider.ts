import { eoDividerNormalsSvg, eoDividersSvg } from "./images";

export const eoDividerStory = {
  storyId: "eo-divider",
  text: {
    en: "divider",
    zh: "分割线",
  },
  description: {
    en: "divider",
    zh: "分割线",
  },
  icon: {
    imgSrc: eoDividersSvg,
  },
  conf: [
    {
      snippetId: "eo-divider[normal]",
      title: {
        zh: "Basic divider",
        en: "基础分割线",
      },
      thumbnail: eoDividerNormalsSvg,
      bricks: [
        {
          brick: "eo-divider",
          properties: {
            textContent: "分割线",
            orientation: "center",
          },
        },
      ],
    },
  ],
};
