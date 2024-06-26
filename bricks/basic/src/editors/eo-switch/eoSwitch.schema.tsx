export const eoSwitchSchema = {
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
      type: "boolean",
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
          text: "开关",
        },
      },
    },
    {
      name: "checkedText",
      title: "选中时的文本",
      type: "string",
    },
    {
      name: "checkedIcon",
      title: "选中时的图标",
      type: "string",
      component: "IconSelect",
    },
    {
      name: "unCheckedText",
      title: "非选中时的文本	",
      type: "string",
    },
    {
      name: "unCheckedIcon",
      title: "非选中时的图标",
      type: "string",
      component: "IconSelect",
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
          label: "普通",
          value: "default",
        },
        {
          label: "小",
          value: "small",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "default",
        },
      },
    },
  ],
};
