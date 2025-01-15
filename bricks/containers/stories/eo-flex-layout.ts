import { Story } from "@next-shared/story";
import {
  eoFlexLayoutBasicSvg,
  eoFlexLayoutGapSvg,
  eoFlexLayoutSvg,
} from "./images";

export const eoFlexLayoutStory: Story = {
  storyId: "eo-flex-layout",
  category: "container-layout",
  author: "kehua",
  text: {
    en: "Flex Layout Container",
    zh: "Flex布局容器",
  },
  description: {
    en: "A Flex layout container",
    zh: "基于Flex的布局容器",
  },
  icon: {
    imgSrc: eoFlexLayoutSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-flex-layout",
          properties: {
            justifyContent: "space-between",
            alignItems: "center",
            style: {
              border: "1px solid black",
              background: "pink",
              height: "200px",
              width: "200px",
            },
          },
          slots: {
            "": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "『第一个div』",
                    style: { background: "yellow" },
                  },
                },
                {
                  brick: "div",
                  properties: {
                    textContent: "『第二个div』",
                    style: { background: "orange" },
                  },
                },
              ],
            },
          },
        },
      ],
      snippetId: "eo-flex-layout[basic]",
      thumbnail: eoFlexLayoutBasicSvg,
      title: {
        en: "Basic Flex Layout",
        zh: "基础flex布局",
      },
    },
    {
      bricks: [
        {
          brick: "eo-flex-layout",
          properties: {
            gap: "20px",
            flexWrap: "wrap",
            style: {
              background: "AliceBlue",
              border: "1px solid black",
              width: "142px",
            },
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "div",
                  properties: {
                    style: {
                      background: "yellow",
                    },
                    textContent: "NO.1",
                  },
                },
                {
                  brick: "div",
                  properties: {
                    style: {
                      background: "orange",
                    },
                    textContent: "NO.2",
                  },
                },
                {
                  brick: "div",
                  properties: {
                    style: {
                      background: "DeepSkyBlue",
                    },
                    textContent: "NO.3",
                  },
                },
                {
                  brick: "div",
                  properties: {
                    style: {
                      background: "Aquamarine",
                    },
                    textContent: "NO.4",
                  },
                },
                {
                  brick: "div",
                  properties: {
                    style: {
                      background: "Chartreuse",
                    },
                    textContent: "NO.5",
                  },
                },
                {
                  brick: "div",
                  properties: {
                    style: {
                      background: "YellowGreen",
                    },
                    textContent: "NO.6",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-flex-layout[gap]",
      thumbnail: eoFlexLayoutGapSvg,
      title: {
        en: "Flex Layout with gap",
        zh: "使用gap的flex布局",
      },
      message: {
        en: "Use attribute gap to change element gap",
        zh: "使用gap改变元素间隙",
      },
    },
  ],
};
