import { eoDynamicFormItemBasicSvg, eoDynamicFormItemSvg } from "./images";

export const eoDynamicFormItemStory = {
  storyId: "eo-dynamic-form-item",
  text: {
    en: "Dynamic Form Item",
    zh: "动态表单项",
  },
  description: {
    en: "Multi-column display, dynamically add or delete each row of form items, currently supports input , select, and other related types",
    zh: "多列显示可以动态增加或删除的表单项，目前支持 input 和 select 等多种类型",
  },
  icon: {
    imgSrc: eoDynamicFormItemSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-dynamic-form-item",
          properties: {
            useBrick: [
              {
                brick: "eo-input",
                properties: {
                  name: "input",
                },
              },
              {
                brick: "eo-select",
                properties: {
                  name: "select",
                  options: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
                },
              },
            ],
            label: "动态表单项",
            name: "dynamic",
            required: true,
          },
        },
      ],
      snippetId: "eo-dynamic-form-item[basic]",
      title: {
        en: "Basic Dynamic Form Item",
        zh: "基础动态表单项",
      },
      thumbnail: eoDynamicFormItemBasicSvg,
    },
  ],
};
