import {
  eoMainViewBasicSvg,
  eoMainViewSvg,
  eoMainViewWithBannerSvg,
} from "./images";

export const eoMainViewStory = {
  storyId: "eo-main-view",
  text: {
    en: "Eo Main View",
    zh: "通用页面视图容器",
  },

  description: {
    en: "Support slots: `breadcrumb`, `pageTitle`, `toolbar`, `banner` (Also be used directly through the snippet of easy-view)",
    zh: "提供了 breadcrumb, pageTitle、toolbar、banner 插槽(也可通过 easy-view 的 snippet 直接使用)",
  },
  icon: {
    imgSrc: eoMainViewSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-main-view",
          slots: {
            pageTitle: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-page-title",
                  properties: {
                    pageTitle: "Page Title",
                  },
                },
              ],
            },
            toolbar: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-button",
                  properties: {
                    textContent: "Create New One",
                  },
                },
                {
                  brick: "eo-button",
                  properties: {
                    textContent: "Edit Existed One",
                  },
                },
              ],
            },
            "": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "hello",
                    style: {
                      border: "3px solid orange",
                      height: "60px",
                      color: "#000",
                      background: "#fff",
                    },
                  },
                },
                {
                  brick: "div",
                  properties: {
                    textContent: "world",
                    style: {
                      border: "3px solid orange",
                      height: "100px",
                      color: "#000",
                      background: "#fff",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      snippetId: "eo-main-view[basic]",
      title: {
        en: "Basic Micro View",
        zh: "基础通用页面视图容器",
      },
      thumbnail: eoMainViewBasicSvg,
    },
    {
      bricks: [
        {
          description: {
            title: "使用 banner",
          },
          brick: "eo-main-view",
          properties: {
            bannerAlone: true,
            bannerTitle: "Hello World",
            bannerImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 200 200'%3E%3Cpolygon fill='%23DCEFFA' points='100 0 0 100 100 100 100 200 200 100 200 0'/%3E%3C/svg%3E\")",
            bannerDescription: "这是一个描述",
          },
          slots: {
            banner: {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-flex-layout",
                  properties: {
                    gap: "8px",
                  },
                  children: [
                    {
                      brick: "eo-button",
                      properties: {
                        textContent: "开始使用",
                        type: "primary",
                      },
                    },
                    {
                      brick: "eo-button",
                      properties: {
                        textContent: "帮助文档",
                      },
                    },
                  ],
                },
              ],
            },
            "": {
              type: "bricks",
              bricks: [
                {
                  brick: "div",
                  properties: {
                    textContent: "content",
                    style: {
                      border: "3px solid orange",
                      height: "60px",
                      color: "#000",
                      background: "#fff",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      snippetId: "eo-main-view[with-banner]",
      title: {
        en: "Eo Main View with Banner Slot",
        zh: "带Banner插槽的通用页面视图容器",
      },
      thumbnail: eoMainViewWithBannerSvg,
    },
  ],
};
