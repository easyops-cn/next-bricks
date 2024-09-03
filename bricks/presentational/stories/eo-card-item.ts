import { Story } from "@next-shared/story";
import {
  cardBlueSvg,
  eoCardItemNormalSvg,
  eoCardItemSvg,
  // eoCardItemWithRightTagSvg,
} from "./images";

export const eoCardItemStory: Story = {
  storyId: "eo-card-item",
  text: {
    en: "Information Display Card",
    zh: "信息展示卡片",
  },
  description: {
    en: "General card item",
    zh: "通用卡片项",
  },
  icon: {
    imgSrc: eoCardItemSvg,
  },
  conf: [
    {
      snippetId: "eo-card-item[normal]",
      title: {
        zh: "通用卡片项",
        en: "",
      },
      message: {
        zh: "可以配置 `expanded-area-1`,`expanded-area-2` 等操作区的插槽。适用场景：用户可凭借图标颜色来区分不同卡片，图标具有分类意义（区分类型／状态）而存在。",
        en: "",
      },
      thumbnail: eoCardItemNormalSvg,
      bricks: [
        {
          brick: "eo-card-item",
          properties: {
            cardTitle: "资源监控微应用",
            description: "资源监控微应用相关前后台",
            url: "/#1",
            avatar: {
              imgSrc: cardBlueSvg,
            },
            hasHeader: true,
            auxiliaryText: "头部提示文本",
            actions: [
              {
                text: "编辑",
                icon: {
                  lib: "antd",
                  icon: "edit",
                },
                isDropdown: false,
              },
              {
                text: "删除",
                isDropdown: true,
                icon: {
                  lib: "antd",
                  icon: "delete",
                },
              },
            ],
          },
          slots: {
            "expanded-area-1": {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-tag-list",
                  properties: {
                    list: [
                      { key: "1", text: "IT资源管理" },
                      { key: "2", text: "资源套餐" },
                      { key: "3", text: "实例管理" },
                    ],
                  },
                },
              ],
            },
            "expanded-area-2": {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    textContent: "INS",
                    icon: {
                      lib: "easyops",
                      category: "default",
                      icon: "card-diff",
                      color: "rgb(157, 168, 184)",
                    },
                  },
                },
                {
                  brick: "eo-button",
                  properties: {
                    textContent: "TASK",
                    icon: {
                      lib: "easyops",
                      category: "default",
                      icon: "card-task-delivery",
                      color: "rgb(157, 168, 184)",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  ],
};
