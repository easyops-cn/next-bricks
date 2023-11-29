import { BrickCommandConf } from "../../interfaces.js";

export const formsBricks: BrickCommandConf[] = [
  {
    brick: "forms.general-input",
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
            params: {
              type: "copyButton",
            },
          },
        ],
      },
    ],
  },
  {
    brick: "forms.general-auto-complete",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: "input[type='search']",
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
    ],
  },
  {
    brick: "forms.general-buttons",
    targets: [
      {
        selectors: [
          {
            type: "testid",
            value: "submit-button",
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "submit",
            },
          },
        ],
      },
      {
        selectors: [
          {
            type: "testid",
            value: "cancel-button",
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
    ],
  },
  {
    brick: "forms.general-checkbox",
    targets: [
      {
        selectors: [
          {
            type: "testid",
            value: "checkbox-form-item",
          },
          {
            type: "css-selector",
            value: ".ant-checkbox-wrapper",
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
    brick: "forms.general-radio",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-radio-group",
          },
          {
            type: "css-selector",
            value: ".ant-radio-wrapper",
            multiple: true,
          },
        ],
        actions: [
          {
            name: "click",
          },
        ],
      },
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-radio-group",
          },
          {
            type: "css-selector",
            value: ".ant-radio-button-wrapper",
            multiple: true,
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "button",
            },
          },
        ],
      },
    ],
  },
  {
    brick: "forms.general-select",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: ".ant-select-selector",
          },
          {
            type: "css-selector",
            value: "input[type='search']",
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
        isolate: true,
        selectors: [
          {
            type: "css-selector",
            value: ".ant-select-dropdown",
          },
          {
            type: "css-selector",
            value: ".ant-select-item",
            multiple: true,
          },
        ],
        actions: [
          {
            name: "click",
            params: {
              type: "item",
            },
          },
        ],
      },
    ],
  },
  {
    brick: "forms.general-switch",
    targets: [
      {
        selectors: [
          {
            type: "testid",
            value: "switch",
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
    brick: "forms.general-textarea",
    targets: [
      {
        selectors: [
          {
            type: "css-selector",
            value: "textarea.ant-input",
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
    ],
  },
];
