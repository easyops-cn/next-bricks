import { Story } from "@next-shared/story";
import {
  eoUserOrUserGroupSelectBasicSvg,
  eoUserOrUserGroupSelectBlankListSvg,
  eoUserOrUserGroupSelectSvg,
} from "./images";

export const eoUserGroupSelectStory: Story = {
  storyId: "eo-user-or-user-group-select",
  text: {
    en: "user-or-user-group-select",
    zh: "用户（组）选择器",
  },
  description: {
    en: "support to select user or user group by modal or select",
    zh: "支持配置选择用户／用户组，下拉框／弹框选择等",
  },
  icon: {
    imgSrc: eoUserOrUserGroupSelectSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-user-or-user-group-select",
          events: {
            "user.group.change": {
              action: "console.log",
            },
          },
          properties: {
            mergeUseAndUserGroup: true,
            name: "username",
            staticList: ["easyops"],
            style: {
              width: "500px",
            },
            value: ["easyops"],
          },
        },
      ],
      snippetId: "eo-user-or-user-group-select[basic]",
      title: {
        en: "Basic User or User Group Select",
        zh: "基础用户(组)选择器",
      },
      thumbnail: eoUserOrUserGroupSelectBasicSvg,
    },
    {
      bricks: [
        {
          brick: "eo-user-or-user-group-select",
          events: {
            "user.group.change": {
              action: "console.log",
            },
          },
          properties: {
            mergeUseAndUserGroup: true,
            name: "username",
            staticList: ["easyops"],
            style: {
              width: "500px",
            },
            value: ["easyops"],
          },
        },
      ],
      snippetId: "eo-user-or-user-group-select[blank-list]",
      title: {
        en: "User or User Group Select with Blank List",
        zh: "带白名单配置的基础用户(组)选择器",
      },
      thumbnail: eoUserOrUserGroupSelectBlankListSvg,
    },
  ],
};
