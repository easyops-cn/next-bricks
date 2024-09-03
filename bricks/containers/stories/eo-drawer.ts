import { Story } from "@next-shared/story";
import { eoDrawerBasicSvg, eoDrawerSvg } from "./images";

export const eoDrawerStory: Story = {
  storyId: "eo-drawer",
  text: {
    en: "General Drawer",
    zh: "Drawer抽屉",
  },
  description: {
    en: "provide slot to hold other custom elements",
    zh: "提供插槽以展示其他构件",
  },
  icon: {
    imgSrc: eoDrawerSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-drawer",
          properties: {
            customTitle: "预览",
            id: "title-demo2",
            maskClosable: true,
            width: 1000,
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "eo-descriptions",
                  properties: {
                    column: 2,
                    descriptionTitle: "基本信息",
                    list: [
                      {
                        label: "名称",
                        text: "easyops",
                      },
                      {
                        label: "环境类型",
                        text: "无",
                      },
                      {
                        label: "授权模式",
                        text: "clientCert",
                      },
                      {
                        label: "服务供应商",
                      },
                    ],
                    showCard: false,
                  },
                },
                {
                  brick: "eo-descriptions",
                  properties: {
                    column: 2,
                    descriptionTitle: "集群规格",
                    list: [
                      {
                        label: "集群来源",
                        text: "导入",
                      },
                      {
                        label: "Manter节点数量",
                        text: "3个",
                      },
                      {
                        label: "可分配CPU",
                        text: "12 Cores",
                      },
                      {
                        label: "可分配内存",
                        text: "44.8GIB",
                      },
                    ],
                    showCard: false,
                    style: {
                      marginTop: "20px",
                    },
                  },
                },
              ],
              type: "bricks",
            },
            extra: {
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    type: "icon",
                    icon: {
                      color: "#167be0",
                      icon: "share-alt",
                      lib: "fa",
                      prefix: "fas",
                    },
                    isDropdown: false,
                    tooltip: "分享",
                    tooltipPlacement: "bottom",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-drawer[basic]",
      title: {
        en: "Basic General Drawer",
        zh: "基础抽屉",
      },
      thumbnail: eoDrawerBasicSvg,
      actions: [
        {
          text: "Open Drawer",
          method: "open",
        },
      ],
    },
    {
      bricks: [
        {
          brick: "eo-drawer",
          properties: {
            customTitle: "预览",
            id: "title-demo3",
            maskClosable: true,
            hasFooter: true,
            closable: true,
            placement: "bottom",
          },
          slots: {
            "": {
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "内容区域",
                  },
                },
              ],
              type: "bricks",
            },
            footer: {
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    type: "primary",
                    textContent: "保存",
                  },
                  events: {
                    click: {
                      target: "#title-demo3",
                      method: "close",
                    },
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-drawer[footer]",
      title: {
        en: "Buttom Drawer",
        zh: "底部抽屉",
      },
      thumbnail: eoDrawerBasicSvg,
      actions: [
        {
          text: "Open Drawer From Buttom",
          method: "open",
        },
      ],
    },
  ],
};
