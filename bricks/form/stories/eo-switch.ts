import { eoSwitchBasicSvg, eoSwitchSvg } from "./images";

export const eoSwitchStory = {
  storyId: "eo-switch",
  text: {
    en: "Switch",
    zh: "开关",
  },
  description: {
    en: "general switch",
    zh: "通用的开关",
  },
  icon: {
    imgSrc: eoSwitchSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-switch",
          properties: {
            label: "开关",
            name: "enabled",
          },
        },
      ],
      snippetId: "eo-switch[basic]",
      title: {
        en: "Basic General Switch",
        zh: "基础开关",
      },
      thumbnail: eoSwitchBasicSvg,
    },
  ],
};
