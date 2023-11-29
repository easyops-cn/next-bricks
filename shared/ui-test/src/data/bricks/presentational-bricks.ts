import { BrickCommandConf } from "../../interfaces.js";

export const presentationalBricks: BrickCommandConf[] = [
  {
    brick: "presentational-bricks.brick-general-search",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-input",
          },
        ],
        actions: [
          {
            name: "click",
          },
          {
            name: "type",
          },
        ],
      },
      {
        selectors: [
          {
            type: "css-selector",
            value: "button.ant-btn-icon-only",
          },
        ],
        actions: [
          {
            name: "click",
          },
        ],
      },
    ],
  },
  {
    brick: "presentational-bricks.brick-link",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: "a",
          },
        ],
        actions: [
          {
            name: "click",
          },
        ],
      },
    ],
  },
  {
    brick: "presentational-bricks.brick-tag",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-tag",
            multiple: true,
          },
        ],
        actions: [
          {
            name: "click",
          },
        ],
      },
    ],
  },
  {
    brick: "presentational-bricks.general-pagination",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-pagination-next",
          },
          {
            type: "css-selector",
            value: ".ant-pagination-item-link",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "next",
            },
          },
        ],
      },
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-pagination-prev",
          },
          {
            type: "css-selector",
            value: ".ant-pagination-item-link",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "prev",
            },
          },
        ],
      },
    ],
  },
];
