export const eoFormSchema = {
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
      name: "layout",
      title: "布局方式",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择文本框类型",
          allowClear: true,
          options: [
            { label: "水平", value: "horizontal" },
            { label: "垂直", value: "vertical" },
            { label: "行内", value: "inline" },
          ].map((item) => ({
            label: item.label,
            value: item.value,
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
      name: "labelCol",
      title: "标签列布局样式",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "wrapperCol",
      title: "输入控件列布局样式",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "formStyle",
      title: "表单样式",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
