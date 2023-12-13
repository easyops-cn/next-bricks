import {
  eoSearchBarSvg,
  eoSearchBarBasicSvg,
  eoSearchBarWithEndSlotSvg,
} from "./images";

export const eoSearchBarStory = {
  storyId: "eo-search-bar",
  text: {
    en: "Search Bar Container",
    zh: "搜索框容器",
  },
  description: {
    en: "A box which can hold search-like element",
    zh: "常用来包裹内容上方的搜索类构件",
  },
  icon: {
    imgSrc: eoSearchBarSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-search-bar",
          slots: {
            start: {
              bricks: [
                {
                  brick: "eo-search",
                  properties: {
                    placeholder: "text here to search",
                  },
                },
              ],
              type: "bricks",
            },
          },
        },
      ],
      snippetId: "eo-search-bar[basic]",
      thumbnail: eoSearchBarBasicSvg,
      title: {
        en: "Basic Search Bar",
        zh: "基础搜索框容器",
      },
    },
    {
      snippetId: "eo-search-bar[with-end-slot]",
      thumbnail: eoSearchBarWithEndSlotSvg,
      title: {
        en: "Search Bar with End Slot",
        zh: "带end插槽的搜索框容器",
      },
      bricks: [
        {
          brick: "eo-search-bar",
          slots: {
            start: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-search",
                  properties: {
                    placeholder: "text here to search",
                  },
                },
                {
                  brick: "eo-select",
                  properties: {
                    options: [
                      "general-drawer",
                      "general-input",
                      "general-select",
                    ],
                    placeholder: "please select a brick",
                    inputStyle: {
                      width: 300,
                    },
                  },
                },
                {
                  brick: "eo-checkbox",
                  properties: {
                    style: {
                      marginLeft: "12px",
                    },
                    options: ["与我相关"],
                  },
                },
              ],
            },
            end: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    type: "primary",
                    icon: {
                      lib: "antd",
                      icon: "reload",
                    },
                  },
                },
                {
                  brick: "eo-button",
                  properties: {
                    icon: {
                      lib: "antd",
                      icon: "fullscreen",
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
