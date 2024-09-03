import { Story } from "@next-shared/story";
import { eoSelectBasicSvg, eoSelectMultiSvg, eoSelectSvg } from "./images";

export const eoSelectStory: Story = {
  storyId: "eo-select",
  text: {
    en: "Select",
    zh: "下拉选择器",
  },
  description: {
    en: "",
    zh: "",
  },
  icon: {
    imgSrc: eoSelectSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-select",
          properties: {
            dataset: {
              testid: "basic-usage-demo",
            },
            name: "gender",
            label: "性别",
            value: "female",
            placeholder: "请选择性别",
            emptyOption: {
              label: "不分性别",
              value: "",
            },
            options: [
              {
                label: "男",
                value: "male",
              },
              {
                label: "女",
                value: "female",
              },
            ],
            inputStyle: {
              width: 120,
            },
          },
        },
      ],
      snippetId: "eo-select[basic]",
      title: {
        en: "Basic General Select",
        zh: "基础下拉选择器",
      },
      thumbnail: eoSelectBasicSvg,
    },
    {
      bricks: [
        {
          brick: "eo-select",
          properties: {
            dataset: {
              testid: "multiple-demo",
            },
            mode: "multiple",
            name: "city",
            label: "城市(多选)",
            value: ["Japan", "China"],
            options: [
              {
                label: "中国",
                value: "China",
              },
              {
                label: "日本",
                value: "Japan",
              },
              {
                label: "韩国",
                value: "Korea",
              },
              {
                label: "美国",
                value: "USA",
              },
            ],
            inputStyle: {
              width: 250,
            },
          },
        },
      ],
      snippetId: "eo-select[multi]",
      title: {
        en: "Multi General Select",
        zh: "多选下拉选择器",
      },
      thumbnail: eoSelectMultiSvg,
    },
    {
      bricks: [
        {
          brick: "eo-select",
          properties: {
            dataset: {
              testid: "group-by-demo",
            },
            inputStyle: {
              width: 250,
            },
            name: "city",
            label: "城市(分组显示)",
            groupBy: "location",
            options: [
              {
                label: "中国",
                value: "China",
                location: "亚洲",
              },
              {
                label: "韩国",
                value: "Korea",
                location: "亚洲",
              },
              {
                label: "日本",
                value: "Japan",
                location: "亚洲",
              },
              {
                label: "美国",
                value: "USA",
                location: "北美洲",
              },
              {
                label: "加拿大",
                value: "Canada",
                location: "北美洲",
              },
              {
                label: "英国",
                value: "UK",
                location: "欧洲",
              },
            ],
          },
        },
      ],
      snippetId: "eo-select[group]",
      title: {
        en: "Group General Select",
        zh: "分组下拉选择器",
      },
      thumbnail: eoSelectSvg,
    },
  ],
};
