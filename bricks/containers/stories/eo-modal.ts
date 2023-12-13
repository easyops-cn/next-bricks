import { eoModalBasicSvg, eoModalFullScreenSvg, eoModalSvg } from "./images";

export const eoModalStory = {
  storyId: "eo-modal",
  text: {
    en: "General Modal",
    zh: "模态框",
  },
  description: {
    en: "provide slot to hold other custom elements, different from forms.general-modal",
    zh: "提供插槽以展示其他构件，注意与表单通用模态框 (forms.general-modal) 的不同",
  },
  icon: {
    imgSrc: eoModalSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-modal",
          properties: {
            id: "origin",
            modalTitle: "Modal Title",
            confirmText: "Save",
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "h3",
                  properties: {
                    textContent: "modal content",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-modal[basic]",
      title: {
        en: "Basic General Modal",
        zh: "基础模态框",
      },
      actions: [
        {
          text: "Open Modal",
          method: "open",
        },
      ],
      thumbnail: eoModalBasicSvg,
    },
    {
      bricks: [
        {
          description: {
            title: "全屏模式",
          },
          brick: "eo-modal",
          properties: {
            fullscreen: true,
            id: "fullscreen-mode",
            modalTitle: "Modal Title",
            confirmText: "Save",
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "h3",
                  properties: {
                    textContent: "modal content",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-modal[full-screen]",
      title: {
        en: "Full Screen General Modal",
        zh: "全屏模态框",
      },
      actions: [
        {
          text: "Open Modal",
          method: "open",
        },
      ],
      thumbnail: eoModalFullScreenSvg,
    },
  ],
};
