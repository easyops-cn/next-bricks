import { eoGridLayoutBasicSvg, eoGridLayoutSvg } from "./images";

export const eoGridLayoutStory = {
  storyId: "eo-grid-layout",
  category: "container-layout",
  type: "brick",
  author: "steve",
  text: {
    en: "Grid Layout",
    zh: "网格布局",
  },
  description: {
    en: "Provide responsive layout by grid",
    zh: "提供多行多列的响应式网格布局",
  },
  icon: {
    imgSrc: eoGridLayoutSvg,
  },
  conf: [
    {
      bricks: [
        {
          brick: "eo-grid-layout",
          properties: {
            columns: 2,
            responsive: {
              medium: {
                columns: 1,
              },
            },
          },
          slots: {
            "": {
              type: "bricks",
              bricks: [
                {
                  brick: "eo-grid-layout",
                  properties: {
                    columns: 2,
                  },
                  slots: {
                    "": {
                      type: "bricks",
                      bricks: [
                        {
                          brick: "div",
                          properties: {
                            style: {
                              gridColumn: "span 2",
                              height: "200px",
                              backgroundColor: "orange",
                            },
                          },
                        },
                        {
                          brick: "div",
                          properties: {
                            style: {
                              height: "100px",
                              backgroundColor: "aquamarine ",
                            },
                          },
                        },
                        {
                          brick: "div",
                          properties: {
                            style: {
                              height: "100px",
                              backgroundColor: "aquamarine ",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  brick: "eo-grid-layout",
                  slots: {
                    "": {
                      type: "bricks",
                      bricks: [
                        {
                          brick: "div",
                          properties: {
                            style: {
                              height: "100px",
                              backgroundColor: "green",
                            },
                          },
                        },
                        {
                          brick: "div",
                          properties: {
                            style: {
                              height: "300px",
                              backgroundColor: "green",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      snippetId: "eo-grid-layout[basic]",
      title: {
        en: "Basic Grid Layout",
        zh: "基础网格布局",
      },
      thumbnail: eoGridLayoutBasicSvg,
    },
  ],
};
