import { BrickCommandConf } from "../../interfaces.js";

export const basicBricks: BrickCommandConf[] = [
  {
    brick: "basic-bricks.general-custom-buttons",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: "button.ant-btn",
            multiple: true,
            field: "buttonIndex",
          },
        ],
        actions: [
          {
            name: "click",
          },
        ],
      },
      {
        isolate: true,
        selectors: [
          {
            type: "css-selector",
            value: ".ant-dropdown",
          },
          {
            type: "css-selector",
            value: ".ant-dropdown-menu-item",
            multiple: true,
            field: "dropdownItemIndex",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "dropdownItem",
            },
          },
        ],
      },
    ],
  },
  {
    brick: "basic-bricks.general-drawer",
    shadowDom: true,
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-drawer-wrapper-body",
          },
          {
            type: "css-selector",
            value: ".ant-drawer-header",
          },
          {
            type: "css-selector",
            value: ".ant-drawer-close",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "close",
            },
          },
        ],
      },
    ],
  },
  {
    brick: "basic-bricks.general-modal",
    shadowDom: true,
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-modal-content",
          },
          {
            type: "css-selector",
            value: ".ant-modal-footer",
          },
          {
            type: "css-selector",
            value: ".okBtn",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "ok",
            },
          },
        ],
      },
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-modal-content",
          },
          {
            type: "css-selector",
            value: ".ant-modal-footer",
          },
          {
            type: "css-selector",
            value: ".cancelBtn",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "cancel",
            },
          },
        ],
      },
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-modal-content",
          },
          {
            type: "css-selector",
            value: ".ant-modal-close",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "close",
            },
          },
        ],
      },
    ],
  },
];
