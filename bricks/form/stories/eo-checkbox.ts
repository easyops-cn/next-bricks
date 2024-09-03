import { Story } from "@next-shared/story";
import {
  eoCheckboxBasicSvg,
  eoCheckboxCustomIconSvg,
  eoCheckboxDisabledSvg,
  eoCheckboxGroupSvg,
  eoCheckboxIconSvg,
  eoCheckboxItemColorSvg,
  // eoCheckboxMultiColumnSvg,
  eoCheckboxSvg,
  eoCheckboxWithIconSvg,
} from "./images";

export const eoCheckboxStory: Story = {
  storyId: "eo-checkbox",
  text: {
    en: "Checkbox",
    zh: "多选框",
  },
  description: {
    en: "General Checkbox",
    zh: "通用多选框",
  },
  icon: {
    imgSrc: eoCheckboxSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            name: "fruits",
            label: "水果",
            options: ["Apple", "Orange", "Pear"],
            value: ["Apple"],
          },
        },
      ],
      snippetId: "eo-checkbox[basic]",
      title: {
        en: "Basic General Checkbox",
        zh: "基础多选框",
      },
      thumbnail: eoCheckboxBasicSvg,
    },
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            name: "user",
            label: "用户",
            options: [
              { label: "管理员", value: "Administrator" },
              { label: "测试", value: "tester" },
              { label: "开发", value: "developer", disabled: true },
            ],
            value: ["tester", "developer"],
          },
        },
      ],
      snippetId: "eo-checkbox[disabled]",
      title: {
        en: "General Checkbox with Disabled Item",
        zh: "带禁用项的多选框",
      },
      thumbnail: eoCheckboxDisabledSvg,
    },
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            name: "user",
            label: "用户",
            options: [
              {
                label: "管理员",
                value: "Administrator",
                checkboxColor: "teal",
              },
              { label: "测试", value: "tester", checkboxColor: "orange" },
              { label: "开发", value: "developer", checkboxColor: "pink" },
              { label: "PM", value: "pm", checkboxColor: "amber" },
            ],
            value: ["tester", "developer", "Administrator", "pm"],
          },
        },
      ],
      snippetId: "eo-checkbox[item-color]",
      title: {
        en: "General Checkbox with Color Item",
        zh: "选项带颜色的多选框",
      },
      thumbnail: eoCheckboxItemColorSvg,
    },
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            label: "用户列表",
            name: "user",
            options: [
              {
                label: "管理员",
                value: "Administrator",
                icon: {
                  imgSrc:
                    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                  imgStyle: {
                    objectFit: "cover",
                    borderRadius: "50%",
                  },
                },
              },
              {
                label: "目标用户",
                value: "tester",
                icon: {
                  icon: "aim",
                  lib: "antd",
                  theme: "outlined",
                  color: {
                    startColor: "var(--palette-red-6)",
                    endColor: "var(--palette-blue-6)",
                  },
                },
              },
              {
                label: "其他用户",
                value: "developer",
                icon: {
                  icon: "bar-chart",
                  lib: "antd",
                  theme: "outlined",
                },
              },
            ],
            value: ["tester", "developer"],
          },
        },
      ],
      snippetId: "eo-checkbox[with-icon]",
      title: {
        en: "General Checkbox with Icon",
        zh: "带图标选项的多选框",
      },
      thumbnail: eoCheckboxWithIconSvg,
    },
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            name: "goods",
            label: "商品",
            isGroup: true,
            optionGroups: [
              {
                name: "水果",
                key: "fruits",
                options: [
                  {
                    label: "苹果",
                    value: "apple",
                  },
                  {
                    label: "香蕉",
                    value: "banana",
                  },
                ],
              },
              {
                name: "蔬菜",
                key: "vegetables",
                options: [
                  {
                    label: "土豆",
                    value: "potato",
                  },
                ],
              },
            ],
            value: ["banana", "potato"],
          },
        },
      ],
      snippetId: "eo-checkbox[group]",
      title: {
        en: "Group General Checkbox",
        zh: "分组多选框",
      },
      thumbnail: eoCheckboxGroupSvg,
    },
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            name: "icon",
            label: "图标",
            type: "icon",
            options: [
              {
                icon: {
                  imgSrc:
                    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
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
                disabled: true,
                label: "pie-chart",
                value: "pie-chart",
              },
            ],
            value: ["area-chart", "pie-chart"],
          },
        },
      ],
      snippetId: "eo-checkbox[icon]",
      title: {
        en: "Icon General Checkbox",
        zh: "图标类型多选框",
      },
      thumbnail: eoCheckboxIconSvg,
    },
    {
      bricks: [
        {
          brick: "eo-checkbox",
          properties: {
            name: "icon",
            label: "图标",
            type: "icon",
            isCustom: true,
            options: [
              {
                icon: {
                  lib: "antd",
                  icon: "area-chart",
                  theme: "outlined",
                },
                label: "area-chart",
                value: "area-chart-1",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "bar-chart",
                  theme: "outlined",
                },
                label: "bar-chart",
                value: "bar-chart-1",
              },
              {
                icon: {
                  lib: "antd",
                  icon: "pie-chart",
                  theme: "outlined",
                },
                disabled: true,
                label: "pie-chart",
                value: "pie-chart-1",
              },
            ],
            value: ["area-chart-1", "pie-chart-1"],
          },
        },
      ],
      snippetId: "eo-checkbox[custom-icon]",
      title: {
        en: "Custom Icon General Checkbox",
        zh: "自定义图标类型多选框",
      },
      thumbnail: eoCheckboxCustomIconSvg,
    },
  ],
};
