import { Story } from "@next-shared/story";
import { eoIconSelectBasicSvg, eoIconSelectSvg } from "./images";

export const eoIconSelectStory: Story = {
  storyId: "eo-icon-select",
  text: {
    en: "Icon Select",
    zh: "图标选择器",
  },
  description: {
    en: "support for selecting icon and output data in specific format",
    zh: "支持选择图标并且输出特定格式的数据",
  },
  icon: {
    imgSrc: eoIconSelectSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-icon-select",
          properties: {
            value: {
              icon: "car",
              lib: "antd",
              theme: "outlined",
              color: "cyan",
            },
            dataset: {
              testid: "basic-usage-demo",
            },
          },
        },
      ],
      snippetId: "eo-icon-select[basic]",
      title: {
        en: "Basic Icon Select",
        zh: "基础图标选择器",
      },
      thumbnail: eoIconSelectBasicSvg,
    },
  ],
};
