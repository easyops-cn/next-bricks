import { Story } from "@next-shared/story";
import {
  eoLinkNormalSvg,
  eoLinkOutsideSvg,
  eoLinkSvg,
  eoLinkWithIconEventsSvg,
} from "./images/index.js";

export const eoLinkStory: Story = {
  storyId: "eo-link",
  icon: {
    imgSrc: eoLinkSvg,
  },
  text: {
    en: "link",
    zh: "链接",
  },
  description: {
    en: "",
    zh: "将值渲染成跳转链接，支持url模板配置",
  },
  conf: [
    {
      snippetId: "eo-link[normal]",
      title: {
        zh: "通用链接",
        en: "",
      },
      thumbnail: eoLinkNormalSvg,
      bricks: [
        {
          brick: "eo-link",
          properties: {
            dataset: { testid: "basic-usage-demo" },
            textContent: "aaa",
            url: "/resources/123",
            target: "_blank",
          },
        },
      ],
    },
    {
      snippetId: "eo-link[outside]",
      title: {
        zh: "通用链接(外部跳转)",
        en: "",
      },
      thumbnail: eoLinkOutsideSvg,
      bricks: [
        {
          brick: "eo-link",
          properties: {
            textContent: "外链跳转",
            href: "https://www.baidu.com",
            target: "_blank",
          },
        },
      ],
    },
    {
      snippetId: "eo-link[with-icon-events]",
      title: {
        zh: "通用链接(带图标事件)",
        en: "",
      },
      thumbnail: eoLinkWithIconEventsSvg,
      bricks: [
        {
          brick: "eo-link",
          properties: {
            textContent: "查看",
            icon: {
              lib: "antd",
              type: "file-search",
              theme: "outlined",
            },
          },
          events: {
            click: {
              action: "console.log",
            },
          },
        },
      ],
    },
  ],
};
