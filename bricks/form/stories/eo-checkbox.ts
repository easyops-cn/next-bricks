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

export const eoCheckboxStory = {
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
          description: {
            title: "设置选项颜色",
            message:
              "在为checkbox（type = default）传入options时，可传入「checkboxColor」属性设置选框颜色，可用颜色包括：red、orange、amber、yellow、green、teal、cyan、blue、indigo、purple、deep-purple、pink 和 blue-gray。",
          },
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
          description: {
            title: "设置checkbox图标",
            message:
              "在为checkbox（type = default）传入options时，可传入「icon」属性为其设置图标，图标来源可以为src（httpSrc/DataSrc）或平台的图标库。",
          },
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
          description: {
            title: "分组复选框",
            message:
              "上层复选框仅作为分类标识，不作为表单数据项，勾选／取消勾选上层复选框可全选／取消全选。每个分组下可包含多个复选框。",
          },
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
          description: {
            title: "使用icon类型样式案例",
            message: "icon图标来源可以为src（httpSrc/DataSrc）或平台的图标库",
          },
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
          description: {
            title: "在icon模式下自定义样式案例",
          },
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
