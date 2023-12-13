import { eoDropdownSvg, eoDropdownNormalSvg } from "./images";

export const eoDropdownButtonStory = {
  storyId: "eo-dropdown-button",
  text: {
    en: "Dropdown Button",
    zh: "带下拉框的按钮",
  },
  description: {
    en: "A button is on the left, and a related functional menu is on the right. ",
    zh: "左边是按钮，右边是额外的相关功能菜单",
  },
  icon: {
    imgSrc: eoDropdownSvg,
  },
  conf: [
    {
      snippetId: "eo-dropdown-button[normal]",
      title: {
        zh: "基础带下拉框的按钮",
        en: "",
      },
      thumbnail: eoDropdownNormalSvg,
      bricks: [
        {
          brick: "eo-dropdown-button",
          properties: {
            btnText: "下拉按钮",
            icon: {
              icon: "setting",
              lib: "antd",
              theme: "outlined",
            },
            actions: [
              {
                text: "Query",
                event: "query",
                icon: {
                  lib: "antd",
                  icon: "search",
                },
              },
              {
                text: "Edit",
                event: "edit",
                icon: {
                  lib: "antd",
                  icon: "edit",
                },
              },
              {
                text: "Delete",
                event: "delete",
                icon: {
                  lib: "antd",
                  icon: "delete",
                },
                disabled: true,
              },
            ],
          },
          events: {
            query: [
              {
                action: "message.info",
                args: ["query"],
              },
            ],
            edit: [
              {
                action: "message.info",
                args: ["edit"],
              },
            ],
          },
        },
      ],
    },
  ],
};
