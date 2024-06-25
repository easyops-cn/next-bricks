export const generalButtonsSchema = {
  name: "layout",
  type: "void",
  component: {
    name: "FormLayout",
    props: {
      layout: "vertical",
    },
  },
  children: [
    {
      name: "categoryTitle_submit",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "提交按钮",
        },
      },
    },
    {
      name: "submitText",
      title: "文字",
      type: "string",
    },
    {
      name: "submitType",
      type: "string",
      title: "类型",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择按钮类型",
          allowClear: true,
          options: [
            {
              label: "主要",
              value: "primary",
            },
            {
              label: "默认",
              value: "default",
            },
            {
              label: "虚线",
              value: "dashed",
            },
            {
              label: "重影",
              value: "ghost",
            },
            {
              label: "链接",
              value: "link",
            },
            {
              label: "文字",
              value: "text",
            },
          ].map((item) => ({
            label: item.label,
            value: item.value,
          })),
        },
      },
    },
    {
      name: "submitDisabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "disableAfterClick",
      title: "点击后禁用",
      type: "boolean",
    },
    {
      name: "submitTooltip",
      title: "文字提示",
      type: "string",
    },
    {
      name: "loading",
      title: "加载动画",
      type: "boolean",
    },
    {
      name: "categoryTitle_cancel",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "取消按钮",
        },
      },
    },
    {
      name: "showCancelButton",
      title: "显示",
      type: "boolean",
    },
    {
      name: "cancelText",
      title: "文字",
      type: "string",
    },
    {
      name: "cancelType",
      type: "string",
      title: "类型",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择按钮类型",
          allowClear: true,
          options: [
            "primary",
            "default",
            "dashed",
            "ghost",
            "link",
            "text",
            "icon",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
  ],
};
