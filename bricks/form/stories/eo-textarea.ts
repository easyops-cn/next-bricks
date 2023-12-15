import { eoTextareaBasicSvg, eoTextareaSvg } from "./images";

export const eoTextareaStory = {
  storyId: "eo-textarea",
  text: {
    en: "Text Area",
    zh: "多行文本输入框",
  },
  description: {
    en: "autoSize, value and placeholder configurable",
    zh: "可支持配置 autoSize, value 和 placeholder",
  },
  icon: {
    imgSrc: eoTextareaSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-textarea",
          properties: {
            autoSize: {
              maxRows: 8,
              minRows: 3,
            },
            label: "描述",
            max: 10,
            message: {
              max: "最长长度限制，10",
              required: "请输入内容",
            },
            name: "description",
            placeholder: "请填写描述",
            required: true,
            value: "This is a long description",
          },
        },
      ],
      snippetId: "eo-textarea[basic]",
      title: {
        en: "Basic General TextArea",
        zh: "基础多行文本输入框",
      },
      thumbnail: eoTextareaBasicSvg,
    },
  ],
};
