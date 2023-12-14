import { eoUploadImgBasicSvg, eoUploadImgSvg } from "./images";

export const eoUploadImageStory = {
  storyId: "eo-upload-image",
  text: {
    en: "upload img",
    zh: "上传图片",
  },
  description: {
    en: "upload image",
    zh: "对接平台对象存储，提供上传图片功能的构件",
  },
  icon: {
    imgSrc: eoUploadImgSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-upload-image",
          properties: {
            label: "图片上传",
            maxNumber: 1,
            bucketName: "test",
          },
        },
      ],
      snippetId: "eo-upload-image[basic]",
      title: {
        en: "Basic Upload Img",
        zh: "基础上传图片",
      },
      thumbnail: eoUploadImgBasicSvg,
    },
  ],
};
