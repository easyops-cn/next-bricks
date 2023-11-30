import { BrickCommandConf } from "../../interfaces.js";

export const containerBricks: BrickCommandConf[] = [
  {
    brick: "container-brick.tabs-container",
    shadowDom: true,
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".tabsNavWrapper",
          },
          {
            type: "css-selector",
            value: ".tabTitle",
            multiple: true,
            field: "tabIndex",
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
    brick: "container-brick.form-steps",
    shadowDom: true,
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: "#next-btn",
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
            value: "#pre-btn",
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
