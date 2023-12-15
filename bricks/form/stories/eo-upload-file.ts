import { eoUploadFilesBasicSvg, eoUploadFilesSvg } from "./images";

export const eoUploadFileStory = {
  storyId: "eo-upload-file",
  text: {
    en: "Custom storage uploads files",
    zh: "自定义存储上传文件",
  },
  description: {
    en: "upload files by specific API",
    zh: "上传文件，适用于表单项中对接provider",
  },
  icon: {
    imgSrc: eoUploadFilesSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-upload-file",
          properties: {
            maxCount: 2,
          },
        },
      ],
      snippetId: "eo-upload-file[basic]",
      title: {
        en: "Basic Upload Files",
        zh: "基础自定义存储上传文件",
      },
      thumbnail: eoUploadFilesSvg,
    },
    {
      bricks: [
        {
          brick: "eo-upload-file",
          properties: {
            style: {
              width: "300px",
            },
            uploadDraggable: true,
            maxCount: 2,
            multiple: true,
            accept: "image/*",
            draggableUploadTip: "支持上传图片",
          },
        },
      ],
      snippetId: "eo-upload-file[draggable]",
      title: {
        en: "Draggable Upload Files",
        zh: "可拖拽自定义存储上传文件",
      },
      thumbnail: eoUploadFilesBasicSvg,
    },
  ],
};
