import { eoPaginationNormalSvg, eoPaginationSvg } from "./images";

export const eoPaginationStory = {
  storyId: "eo-pagination",
  text: {
    en: "General pagination",
    zh: "分页",
  },
  description: {
    en: "General pagination brick",
    zh: "通用分页构件",
  },
  icon: {
    imgSrc: eoPaginationSvg,
  },
  conf: [
    {
      snippetId: "eo-pagination[normal]",
      thumbnail: eoPaginationNormalSvg,
      title: {
        en: "",
        zh: "基础分页",
      },
      bricks: [
        {
          brick: "eo-pagination",
          properties: {
            page: 1,
            pageSize: 10,
            total: 100,
            dataset: { testid: "basic-usage-pagination-demo" },
          },
        },
      ],
    },
  ],
};
