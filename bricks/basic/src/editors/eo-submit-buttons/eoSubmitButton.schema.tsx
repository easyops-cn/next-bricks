export const eoSubmitButtonsSchema = {
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
      title: "按钮文字",
      type: "string",
    },
    {
      name: "submitType",
      type: "string",
      title: "按钮类型",
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
      name: "cancelText",
      title: "按钮文字",
      type: "string",
    },
    {
      name: "cancelType",
      type: "string",
      title: "按钮类型",
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
