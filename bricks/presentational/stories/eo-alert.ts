import { Story } from "@next-shared/story";
import {
  eoAlertInfoTipsWithIconSvg,
  eoAlertSuccessTipsSvg,
  eoAlertSvg,
  eoAlertWarnTipsWithCloseSvg,
  eoAleryWithSlotSvg,
} from "./images";

export const eoAlertStory: Story = {
  storyId: "eo-alert",
  text: {
    en: "Alert",
    zh: "警告提示",
  },
  description: {
    en: "alert content, configurable with color type, description and showIcon",
    zh: "警告提示，可配置颜色类型，描述和是否显示图标",
  },
  icon: {
    imgSrc: eoAlertSvg,
  },
  conf: [
    {
      snippetId: "eo-alert[success-tips]",
      bricks: [
        {
          brick: "eo-alert",
          properties: {
            type: "success",
            textContent: "tool executed successfully",
          },
        },
      ],
      title: {
        en: "Success alert",
        zh: "成功提示",
      },
      thumbnail: eoAlertSuccessTipsSvg,
    },
    {
      snippetId: "eo-alert[info-tips-with-icon]",
      bricks: [
        {
          brick: "eo-alert",
          properties: {
            type: "info",
            showIcon: true,
            textContent: "tool executed successfully",
          },
        },
      ],
      title: {
        en: "Info alert with icon",
        zh: "带图标正常提示",
      },
      thumbnail: eoAlertInfoTipsWithIconSvg,
    },
    {
      snippetId: "eo-alert[warn-tips-with-close]",
      message: {
        en: "",
        zh: "当 `closable` 为true，`localStorageKey` 不为空时，以页面 url 为命名空间，控制提示在当前路径关闭后不再显示。可通过设置 `stripLocalStorageUrlSuffix` 为true关闭url命名空间，使提示的关闭全局有效",
      },
      bricks: [
        {
          brick: "eo-alert",
          properties: {
            type: "warning",
            textContent: "Today is Tuesday",
            closable: true,
            showIcon: true,
            localStorageKey: "",
          },
        },
      ],
      title: {
        en: "Warn Alert with close",
        zh: "警告提示带关闭按钮",
      },
      thumbnail: eoAlertWarnTipsWithCloseSvg,
    },
    {
      snippetId: "eo-alert[with-slot]",
      thumbnail: eoAleryWithSlotSvg,
      message: {
        en: "",
        zh: "本示例额外使用了通过target改变具体构件属性的知识点",
      },
      title: {
        zh: "带插槽提示",
        en: "Alert with slots",
      },
      bricks: [
        {
          brick: "eo-alert",
          properties: {
            type: "info",
            showIcon: true,
            message: "Today is Tuesday",
          },
          slots: {
            "": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  slots: {
                    "": {
                      type: "bricks",
                      bricks: [
                        {
                          brick: "strong",
                          properties: {
                            textContent: "Temperature: ",
                          },
                        },
                        {
                          brick: "span",
                          properties: {
                            textContent: "24°C",
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  brick: "div",
                  slots: {
                    "": {
                      type: "bricks",
                      bricks: [
                        {
                          brick: "strong",
                          properties: {
                            textContent: "Weather: ",
                          },
                        },
                        {
                          brick: "span",
                          properties: {
                            textContent: "not bad",
                          },
                        },
                        {
                          brick: "eo-button",
                          properties: {
                            style: {
                              margin: "12px",
                            },
                            textContent: "hello-button",
                            icon: {
                              icon: "search",
                              lib: "antd",
                            },
                            type: "primary",
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  ],
};
