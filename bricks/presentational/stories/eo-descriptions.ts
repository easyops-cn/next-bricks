import { eoDescriptionsNormalSvg, eoDescriptionsSvg } from "./images";

export const eoDescriptionsStory = {
  storyId: "eo-descriptions",
  text: {
    en: "Descriptions",
    zh: "描述列表",
  },
  description: {
    en: "",
    zh: "常用于概要信息的描述，2~3列",
  },
  icon: {
    imgSrc: eoDescriptionsSvg,
  },
  conf: [
    {
      snippetId: "eo-descriptions[normal]",
      text: {
        zh: "描述列表",
        en: "Description list",
      },
      thumbnail: eoDescriptionsNormalSvg,
      bricks: [
        {
          brick: "eo-descriptions",
          properties: {
            list: [
              {
                text: "Lynette",
                label: "UserName",
              },
              {
                text: "18",
                label: "Age",
              },
              {
                label: "Tags",
                useBrick: {
                  brick: "eo-tag-list",
                  properties: {
                    list: "<% DATA.tags %>",
                    configProps: {
                      color: "orange",
                    },
                    showCard: false,
                  },
                },
              },
            ],
            descriptionTitle: "User Info",
            dataSource: {
              tags: ["user", "admin"],
            },
          },
        },
      ],
    },
  ],
};
