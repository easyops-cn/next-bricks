import {
  eoButtonSvg,
  eoButtonbasicSvg,
  eoButtonDangerSvg,
  eoButtonDisabledSvg,
  eoButtonIconSvg,
  eoButtonLinkSvg,
  eoButtonPrimarySvg,
  eoButtonTextSvg,
} from "./images/index.js";

export const eoButtonStory = {
  storyId: "eo-button",
  icon: {
    imgSrc: eoButtonSvg,
  },
  text: {
    en: "General button",
    zh: "通用按钮",
  },
  description: {
    en: "General button",
    zh: "可发送点击事件、可配置按钮名称、按钮跳转链接等",
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-button",
          properties: {
            textContent: "新建",
            tooltip: "新建实例",
            icon: {
              lib: "fa",
              icon: "edit",
              prefix: "fas",
            },
            dataset: {
              testid: "basic-usage-demo",
            },
          },
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
        },
      ],
      snippetId: "eo-button[basic]",
      title: {
        en: "Baisc General Button",
        zh: "基础按钮",
      },
      thumbnail: eoButtonbasicSvg,
    },
    {
      bricks: [
        {
          brick: "eo-button",
          properties: {
            textContent: "新建",
            disabled: true,
            disabledTooltip: "无权限",
            tooltip: "新建实例",
          },
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
        },
      ],
      snippetId: "eo-button[disabled]",
      title: {
        en: "disabled General Button",
        zh: "禁用按钮",
      },
      thumbnail: eoButtonDisabledSvg,
    },
    {
      bricks: [
        {
          brick: "eo-button",
          properties: {
            buttonShape: "round",
            textContent: "搜索",
            type: "primary",
            icon: {
              lib: "antd",
              icon: "search",
            },
            url: "/",
            target: "_blank",
          },
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
        },
      ],
      snippetId: "eo-button[primary]",
      title: {
        en: "Primary General Button",
        zh: "primary样式按钮",
      },
      thumbnail: eoButtonPrimarySvg,
    },
    {
      bricks: [
        {
          brick: "eo-button",
          properties: {
            buttonShape: "circle",
            type: "icon",
            icon: {
              lib: "antd",
              icon: "search",
            },
            url: "/",
            target: "_blank",
          },
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
        },
      ],
      snippetId: "eo-button[icon]",
      title: {
        en: "Icon General Button",
        zh: "图标按钮",
      },
      thumbnail: eoButtonIconSvg,
    },
    {
      bricks: [
        {
          brick: "eo-button",
          description: {
            title: "文字按钮",
            message: "默认和平台文字颜色一致",
          },
          properties: {
            type: "text",
            textContent: "更多",
            url: "/",
            target: "_blank",
          },
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
        },
      ],
      snippetId: "eo-button[text]",
      title: {
        en: "Text General Button",
        zh: "文字按钮",
      },
      thumbnail: eoButtonTextSvg,
    },
    {
      bricks: [
        {
          brick: "eo-button",
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
          properties: {
            type: "link",
            url: "/demo",
            textContent: "this is link",
          },
        },
      ],
      snippetId: "eo-button[link]",
      title: {
        en: "Link General Button",
        zh: "link按钮",
      },
      thumbnail: eoButtonLinkSvg,
    },
    {
      bricks: [
        {
          brick: "eo-button",
          events: {
            click: [
              {
                action: "message.info",
                args: ["click button"],
              },
            ],
          },
          properties: {
            danger: true,
            textContent: "danger button",
          },
        },
      ],
      snippetId: "eo-button[danger]",
      title: {
        en: "danger General Button",
        zh: "danger类型按钮",
      },
      thumbnail: eoButtonDangerSvg,
    },
  ],
};
