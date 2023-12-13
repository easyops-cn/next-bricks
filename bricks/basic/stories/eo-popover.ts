import { eoPopoverBasicSvg, eoPopoverSvg } from "./images";

export const eoPopoverStory = {
  storyId: "eo-popover",
  text: {
    en: "popover container",
    zh: "气泡卡片容器",
  },
  description: {
    en: "",
    zh: "可以配置显示构件和弹出框构件，常用于快速编辑和详情展示",
  },
  icon: {
    imgSrc: eoPopoverSvg,
  },
  conf: [
    {
      snippetId: "eo-popover[basic]",
      thumbnail: eoPopoverBasicSvg,
      bricks: [
        {
          brick: "eo-popover",
          properties: {
            trigger: "hover",
            placement: "bottom",
          },
          children: [
            {
              brick: "eo-input",
              slot: "anchor",
            },
            {
              brick: "div",
              properties: {
                style: {
                  width: "200px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "pink",
                },
                textContent: "I'm popover",
              },
            },
          ],
        },
      ],
    },
  ],
};
