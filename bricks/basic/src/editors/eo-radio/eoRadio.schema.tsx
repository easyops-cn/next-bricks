export const eoRadioSchema = {
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
      name: "categoryTitle_item",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "表单项",
        },
      },
    },
    {
      name: "name",
      title: "字段名",
      type: "string",
    },
    {
      name: "label",
      title: "标签",
      type: "string",
    },
    {
      name: "value",
      title: "值",
      type: "string",
    },
    {
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "categoryTitle_input",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "单选框",
        },
      },
    },
    {
      name: "options",
      title: "选项列表",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "type",
      title: "类型",
      type: "string",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择文本框类型",
          allowClear: true,
          options: [
            { label: "按钮", value: "button" },
            { label: "默认", value: "default" },
            { label: "图标", value: "icon" },
            { label: "圆形图标", value: "icon-circle" },
            { label: "方形图标", value: "icon-square" },
            { label: "自定义", value: "custom" },
          ].map((item) => ({
            label: item.label,
            value: item.value,
          })),
        },
      },
    },
    {
      name: "ui",
      title: "类型",
      type: "string",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择ui样式",
          allowClear: true,
          options: ["default", "dashboard"].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "size",
      title: "大小",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "大",
          value: "large",
        },
        {
          label: "标准",
          value: "medium",
        },
        {
          label: "小",
          value: "small",
        },
        {
          label: "超小",
          value: "xs",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
        },
      },
    },
    {
      name: "customStyle",
      title: "radio的外层样式",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "useBrick",
      title: "自定义构件",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "categoryTitle_validator",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "校验",
        },
      },
    },
    {
      name: "required",
      title: "是否必填",
      type: "boolean",
    },
    {
      name: "message",
      title: "校验文本",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
