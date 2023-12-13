import { eoImageNormalSvg, eoImageSvg } from "./images";

export const eoImageStory = {
  storyId: "eo-button",
  text: {
    en: "General Image",
    zh: "图片展示构件",
  },
  description: {
    en: "Image brick that supports preview",
    zh: "支持预览的图片展示构件",
  },
  icon: {
    imgSrc: eoImageSvg,
  },
  conf: [
    {
      snippetId: "eo-image[normal]",
      title: {
        en: "Basic picture display components",
        zh: "基本图片展示构件",
      },
      thumbnail: eoImageNormalSvg,
      bricks: [
        {
          description: {
            title: "基本用法",
          },
          brick: "eo-image",
          properties: {
            imgList: [
              {
                src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                width: 100,
              },
            ],
          },
        },
      ],
    },
  ],
};
