import {
  eoRadioBasicSvg,
  eoRadioButtonSvg,
  eoRadioIconButtonSvg,
  eoRadioIconSvg,
  eoRadioSvg,
  eoRadioWithIconSvg,
} from "./images";

export const eoRadioStory = {
  storyId: "eo-radio",
  text: {
    en: "Radio",
    zh: "单选框",
  },
  description: {
    en: "general Radio",
    zh: "通用的单选框",
  },
  icon: {
    imgSrc: eoRadioSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-radio",
          properties: {
            dataset: { testid: "basic-usage-demo" },
            name: "city",
            label: "城市",
            value: "Shanghai",
            options: ["Shanghai", "Beijing", "Chengdu"],
          },
        },
      ],
      snippetId: "eo-radio[basic]",
      title: {
        en: "Basic General Radio",
        zh: "基础单选框",
      },
      thumbnail: eoRadioBasicSvg,
    },
    {
      bricks: [
        {
          brick: "eo-radio",
          properties: {
            name: "city",
            label: "城市",
            value: "Shanghai",
            type: "button",
            options: [
              {
                label: "上海",
                value: "Shanghai",
              },
              {
                label: "北京",
                value: "Beijing",
              },
              {
                label: "成都",
                value: "Chengdu",
              },
            ],
          },
        },
      ],
      snippetId: "eo-radio[button]",
      title: {
        en: "Button General Radio",
        zh: "按钮单选框",
      },
      thumbnail: eoRadioButtonSvg,
    },
    {
      bricks: [
        {
          brick: "eo-radio",
          description: {
            title: "当type = default时，给radio设置图标",
          },
          properties: {
            label: "城市",
            name: "city",
            options: [
              {
                label: "上海",
                value: "Shanghai",
                icon: {
                  icon: "bar-chart",
                  lib: "antd",
                  theme: "outlined",
                  iconStyle: {
                    color: "blue",
                    fontSize: "18px",
                  },
                },
              },
              {
                icon: {
                  imgSrc:
                    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                  imgStyle: {
                    objectFit: "cover",
                    borderRadius: "50%",
                  },
                },
                label: "北京",
                value: "Beijing",
              },
              {
                label: "成都",
                value: "Chengdu",
                icon: {
                  color: {
                    endColor: "var(--palette-blue-6)",
                    startColor: "var(--palette-red-6)",
                  },
                  icon: "aim",
                  lib: "antd",
                  theme: "outlined",
                },
              },
            ],
            value: "Beijing",
          },
        },
      ],
      snippetId: "eo-radio[with-icon]",
      title: {
        en: "General Radio with Icon",
        zh: "带图标选项的单选框",
      },
      thumbnail: eoRadioWithIconSvg,
    },
    {
      bricks: [
        {
          description: {
            title: "使用图标按钮样式",
          },
          brick: "eo-radio",
          events: {
            "general.radio.change": {
              action: "console.log",
              args: ["<% EVENT.detail %>"],
            },
          },
          properties: {
            label: "图表",
            name: "chart",
            options: [
              {
                icon: {
                  lib: "antd",
                  icon: "area-chart",
                  theme: "outlined",
                },
                value: "area-chart",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "bar-chart",
                  theme: "outlined",
                },
                value: "bar-chart",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "pie-chart",
                  theme: "outlined",
                },
                value: "pie-chart",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "radar-chart",
                  theme: "outlined",
                },
                value: "radar-chart",
              },
            ],
            type: "button",
            value: "Shanghai",
          },
        },
      ],
      snippetId: "eo-radio[icon-button]",
      title: {
        en: "Icon Button General Radio",
        zh: "图标按钮单选框",
      },
      thumbnail: eoRadioIconButtonSvg,
    },
    {
      bricks: [
        {
          description: {
            title: "使用icon类型样式案例",
          },
          brick: "eo-radio",
          properties: {
            label: "图标",
            name: "icon",
            options: [
              {
                icon: {
                  lib: "antd",
                  icon: "area-chart",
                  theme: "outlined",
                },
                label: "area-chart",
                value: "area-chart",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "bar-chart",
                  theme: "outlined",
                },
                label: "bar-chart",
                value: "bar-chart",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "pie-chart",
                  theme: "outlined",
                },
                label: "pie-chart",
                value: "pie-chart",
              },
            ],
            type: "icon",
            value: "area-chart",
          },
        },
      ],
      snippetId: "eo-radio[icon]",
      title: {
        en: "Icon General Radio",
        zh: "图标单选框",
      },
      thumbnail: eoRadioIconSvg,
    },
  ],
  previewColumns: 2,
};
