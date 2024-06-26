export const generalSwitchSchema = {
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
      name: "notRender",
      title: "隐藏",
      type: "boolean",
    },
    {
      name: "trim",
      title: "去除前后的空白符",
      type: "boolean",
    },
    {
      type: "string",
      title: "标签对齐方式",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择",
          allowClear: true,
          options: [
            {
              label: "左对齐",
              value: "left",
            },
            {
              label: "右对齐",
              value: "right",
            },
          ].map((item) => ({
            label: item.label,
            value: item.value,
          })),
        },
      },
    },
    {
      name: "labelColor",
      title: "标签颜色",
      type: "string",
    },
    {
      name: "labelBold",
      title: "标签颜色",
      type: "boolean",
    },
    {
      name: "labelTooltip",
      title: "标签提示",
      type: "string",
    },
    {
      name: "labelCol",
      title: "标签布局	",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "labelBrick",
      title: "标签构件",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
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
          label: "标准",
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
      name: "wrapperCol",
      title: "控件布局",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "helpBrick",
      title: "帮助构件",
      type: "string",
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
      title: "必填",
      type: "boolean",
    },
    {
      name: "message",
      title: "校验文本",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
