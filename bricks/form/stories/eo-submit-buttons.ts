import { eoSubmitButtonsBasicSvg, eoSubmitButtonsSvg } from "./images";

export const eoSubmitButtonsStory = {
  storyId: "eo-checkbox",
  text: {
    en: "General buttons",
    zh: "表单提交按钮",
  },
  description: {
    en: "can be used in general-forms,support to set submit button and cancel button",
    zh: "用于general-forms的通用按钮，可以配置submit按钮和cancel按钮",
  },
  icon: {
    imgSrc: eoSubmitButtonsSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-submit-buttons",
          properties: {
            submitText: "提交",
            cancelText: "取消",
            dataset: {
              testid: "basic-usage-demo",
            },
          },
        },
      ],
      snippetId: "eo-submit-buttons[basic]",
      thumbnail: eoSubmitButtonsBasicSvg,
      title: {
        en: "Basic General Buttons",
        zh: "基础表单提交按钮",
      },
    },
  ],
};
