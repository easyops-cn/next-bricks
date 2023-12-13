import { eoTabListNormalSvg, eoTabListPanelSvg, eoTabListSvg } from "./images";

export const eoTabListStory = {
  storyId: "eo-tab-list",
  text: {
    en: "Tabs Container",
    zh: "tab容器构件",
  },
  description: {
    en: "tabs container",
    zh: "提供平级的区域将大块内容进行收纳和展现，保持界面整洁",
  },
  icon: {
    imgSrc: eoTabListSvg,
  },
  conf: [
    {
      snippetId: "eo-tab-list[normal]",
      title: {
        en: "Basic tab container",
        zh: "基本tab容器构件",
      },
      thumbnail: eoTabListNormalSvg,
      message: {
        en: "",
        zh: "设置了3个不同的Tab，每个Tab的内容可以通过content插槽来设置。还有一个额外的插槽extraContent，位于容器的右上角。",
      },
      bricks: [
        {
          brick: "eo-tab-list",
          properties: {
            dataset: {
              testid: "basic-usage-demo",
            },
            tabs: [
              {
                text: "Tab1",
                panel: "Tab1",
              },
              {
                text: "Tab2",
                panel: "Tab2",
                panelColor: "var(--palette-green-6)",
              },
              {
                text: "Tab3",
                panel: "Tab3",
                panelColor: "var(--palette-red-6)",
              },
            ],
          },
          slots: {
            Tab1: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-form",
                  properties: {
                    values: {
                      username: "easyops",
                    },
                  },
                  slots: {
                    items: {
                      type: "bricks",
                      bricks: [
                        {
                          brick: "eo-input",
                          properties: {
                            name: "username",
                            label: "用户名",
                            required: false,
                            placeholder: "请输入用户名",
                          },
                        },
                        {
                          brick: "eo-input",
                          properties: {
                            name: "password",
                            type: "password",
                            label: "密码",
                            required: false,
                            placeholder: "请输入密码",
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
            Tab2: {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "Panel 2",
                  },
                },
              ],
            },
            Tab3: {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "Panel 3",
                  },
                },
              ],
            },
            extra: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    icon: {
                      lib: "antd",
                      icon: "plus",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
    {
      snippetId: "eo-tab-list[panel]",
      thumbnail: eoTabListPanelSvg,
      title: {
        en: "Custom panel tabs",
        zh: "自定义panel tab容器",
      },
      message: {
        en: "",
        zh: "提供了 Panel 样式给用户使用",
      },
      bricks: [
        {
          brick: "eo-tab-list",
          properties: {
            dataset: {
              testid: "panel-style-demo",
            },
            type: "panel",
            tabs: [
              {
                text: "详情",
                badgeConf: {
                  count: 100,
                  color: "red",
                },
                panel: "0",
              },
              {
                text: "统计",
                badgeConf: {
                  count: 9,
                  color: "green",
                },
                panel: "1",
              },
              {
                text: "示例",
                badgeConf: {
                  count: 30,
                  color: "blue",
                },
                disabled: true,
                panel: "2",
              },
            ],
            activePanel: 1,
          },
          slots: {
            "0": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "Panel 1",
                  },
                },
              ],
            },
            "1": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "Panel 2",
                  },
                },
              ],
            },
            "2": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "Panel 3",
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
