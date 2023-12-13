import { eoTooltipNormalSvg, eoTooltipSvg } from "./images";

export const eoToolTipStory = {
  storyId: "eo-tooltip",
  icon: {
    imgSrc: eoTooltipSvg,
  },
  text: {
    en: "Tooltip Text Prompt",
    zh: "Tooltip文字提示",
  },
  description: {
    en: "general tooltip",
    zh: "普通的 tooltip",
  },
  conf: [
    {
      snippetId: "eo-tooltip[normal]",
      title: {
        en: "",
        zh: "基础的tooltips",
      },
      thumbnail: eoTooltipNormalSvg,
      message: {
        zh: "鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作；建议短文本提示信息不超过10个字，文字过长时请用气泡卡片",
        en: "",
      },
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
              brick: "eo-button",
              properties: {
                type: "primary",
                textContent: "hover",
              },
            },
          ],
        },
      ],
    },
  ],
};
