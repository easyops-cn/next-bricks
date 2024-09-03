import { Story } from "@next-shared/story";
import {
  eoTagListDisabledWithCloseSvg,
  eoTagListNormalSvg,
  eoTagListSvg,
} from "./images";

export const eoTagListStory: Story = {
  storyId: "eo-tab-list",
  text: {
    en: "Tag Label",
    zh: "Tag 标签",
  },
  tags: [
    {
      en: "show",
      zh: "数据显示",
    },
  ],
  description: {
    en: "tag label, support Tag and CheckableTag",
    zh: "进行标记和分类的小标签，同时支持基本标签和可选中标签",
  },
  icon: {
    imgSrc: eoTagListSvg,
  },
  conf: [
    {
      snippetId: "eo-tag-list[normal]",
      title: {
        zh: "基本",
        en: "",
      },
      message: {
        zh: "标签支持多彩标签、可选择标签、可删除标签。",
        en: "",
      },
      thumbnail: eoTagListNormalSvg,
      bricks: [
        {
          brick: "eo-tag-list",
          properties: {
            color: "green",
            showTagCircle: true,
            list: ["Active", "Normal"],
          },
        },
      ],
    },
    {
      snippetId: "eo-tag-list[disabled-with-close]",
      title: {
        zh: "复杂场景标签",
        en: "",
      },
      thumbnail: eoTagListDisabledWithCloseSvg,
      bricks: [
        {
          brick: "eo-tag-list",
          properties: {
            closable: true,
            checkable: true,
            list: [
              {
                key: "p1",
                text: "紧急变更",
                disabled: true,
              },
              {
                key: "p2",
                text: "计划变更",
                disabled: true,
              },
              {
                key: "p3",
                text: "发布流程",
              },
              {
                key: "p4",
                text: "发布流程",
              },
              {
                key: "p5",
                text: "发布计划",
              },
              {
                key: "p6",
                text: "测试计划",
              },
            ],
          },
        },
      ],
    },
  ],
};
