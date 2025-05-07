export const brickMap: Record<
  string,
  {
    brick: string;
    properties?: Record<string, any>;
    events?: Record<string, any>;
    slots?: Record<string, any>;
  }
> = {
  "basic-bricks.general-button": {
    brick: "basic.general-brick",
    properties: {
      buttonName: "textContent",
      buttonSize: "size",
      buttonIcon: "icon",
      buttonShape: "shape",
      buttonType: "type",
      buttonUrl: "href",
      buttonHref: "href",
      buttonDanger: "danger",
    },
    events: {
      "general.button.click": "click",
    },
  },
  "presentational-bricks.brick-link": {
    brick: "basic.general-link",
    properties: {
      label: "textContent",
      underLine: "underline",
      to: "href",
    },
    events: {
      "link.click": "click",
    },
  },
  "presentational-bricks.brick-tag": {
    brick: "containers.general-tag-list",
    properties: {
      tagList: "list",
      multipleCheck: "multiple",
    },
    events: {
      "checked.update": (value: Record<string, any>) => {
        return [
          "checked",
          JSON.stringify(value).replace(/EVENT.detail/g, "EVENT.detail.item"),
        ];
      },
      "checked.update.v2": (value: Record<string, any>) => {
        return [
          "checked",
          JSON.stringify(value).replace(/EVENT.detail/g, "EVENT.detail.item"),
        ];
      },
      "tag.close": (value: Record<string, any>) => {
        return [
          "checked",
          JSON.stringify(value).replace(
            /EVENT.detail.current|EVENT.detail.tagList/g,
            (match: string) => {
              switch (match) {
                case "EVENT.detail.current":
                  return "EVENT.detail.item";
                case "EVENT.detail.tagList":
                  return "EVENT.detail.list";
                default:
                  return "";
              }
            }
          ),
        ];
      },
    },
  },
  "basic-bricks.general-text": {
    brick: "basic.general-text",
    properties: {
      text: "textContent",
    },
  },
  // containers
  "basic-bricks.micro-view": {
    brick: "containers.micro-view",
    slots: {
      content: "",
    },
  },
  "basic-bricks.general-card": {
    brick: "containers.general-card",
    slots: {
      content: "",
    },
  },
  "basic-bricks.general-modal": {
    brick: "containers.general-modal",
    properties: {
      okText: "confirmText",
      okDisabled: "confirmDisabled",
      closeWhenOk: "closeWhenConfirm",
    },
    events: {
      "modal.open": "open",
      "modal.close": "close",
      "basic-bricks.general-modal.confirm": "confirm",
      "basic-bricks.general-modal.cancel": "cancel",
    },
    slots: {
      content: "",
    },
  },
  "container-brick.tabs-container": {
    brick: "containers.tab-list",
    properties: {
      tabList: (value: Array<any>) => {
        return [
          "tabs",
          value.map((item) => {
            return {
              ...item,
              panel: item.key,
            };
          }),
        ];
      },
      activeTabIndex: "activeTabPanel",
    },
    slots: {
      content: (index: number, properties: Record<string, any>) => {
        const tabs = properties.tabs;
        return tabs[index].panel;
      },
    },
  },
  "container-brick.category-container": {
    brick: "containers.general-category",
    properties: {
      category: "categories",
    },
  },
  "basic-bricks.general-drawer": {
    brick: "containers.general-drawer",
    events: {
      "general.drawer.open": "open",
      "general.drawer.close": "close",
    },
    slots: {
      content: "",
      headerRight: "extra",
    },
  },
  // form
  "forms.dynamic-form-item": {
    brick: "form.dynamic-form-item",
    properties: {
      // 数据变化
      columns: (value: string) => {
        // todo: fix
        return [
          "useBrick",
          []
        ]
      },
    },
  },
  "forms.general-input": {
    brick: "form.general-input",
    properties: {
      inputBoxStyle: "inputStyle",
    },
    events: {
      "general.input.blur": "blur",
      "general.input.focus": "focus",
      "general.input.change": "change",
    },
  },
  "forms.general-select": {
    brick: "form.general-select",
    properties: {
      inputBoxStyle: "inputStyle",
      mode: (value: string) => {
        if (value === "multiple") {
          return ["multiple", true];
        }
        return ["mode", value];
      },
    },
    events: {
      "general.select.change": (value: Record<string, any>) => {
        return [
          "change",
          JSON.stringify(value).replace(/EVENT.detail/g, "EVENT.detail.value"),
        ];
      },
      "general.select.change.v2": (value: string) => {
        return [
          "change",
          JSON.stringify(value).replace(/EVENT.detail/g, "EVENT.detail.value"),
        ];
      },
      "general.select.options.change": "options.change",
    },
  },
  "forms.general-radio": {
    brick: "form.general-radio",
    properties: {},
    events: {
      // todo: fix
      "general.radio.change": "change",
      "general.radio.change.v2": "change",
      "general.radio.options.change": "options.change",
    },
  },
  "forms.generl-checkbox": {
    brick: "form.general-checkbox",
    properties: {},
    events: {
      "general.checkbox.change": "change",
      "general.checkbox.change.v2": "change",
    },
  },
  "forms.general-form": {
    brick: "form.general-form",
  },
  "forms.general-form-item": {
    brick: "form.general-form-item",
  },
  "forms.general-textarea": {
    brick: "form.general-textarea",
    events: {
      "general.textarea.blur": "blur",
      "general.textarea.change": "change",
      "general.textarea.focus": "focus",
    },
  },
};
