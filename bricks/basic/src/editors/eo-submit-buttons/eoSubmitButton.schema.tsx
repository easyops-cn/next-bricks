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
      component: {
        name: "Input",
        props: {
          placeholder: "提交",
        },
      },
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
          defaultValue: "primary",
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
          ],
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
          defaultValue: "link",
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
          ],
        },
      },
    },
  ],
};
