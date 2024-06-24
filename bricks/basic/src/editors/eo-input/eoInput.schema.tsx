export const eoInputSchema = {
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
      name: "readonly",
      title: "只读",
      type: "boolean",
    },
    {
      name: "categoryTitle_input",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "文本框",
        },
      },
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
            "button",
            "checkbox",
            "color",
            "date",
            "datetime-local",
            "email",
            "file",
            "hidden",
            "image",
            "month",
            "number",
            "password",
            "radio",
            "range",
            "reset",
            "search",
            "submit",
            "tel",
            "text",
            "time",
            "url",
            "week",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
    },
    {
      name: "autoFocus",
      title: "自动聚焦",
      type: "boolean",
    },
    {
      name: "clearable",
      title: "显示清除按钮",
      type: "boolean",
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
      name: "maxLength",
      title: "最大长度",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "minLength",
      title: "最小长度",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
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
      name: "pattern",
      title: "正则校验规则",
      type: "string",
    },
    {
      name: "max",
      title: "最大长度",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "min",
      title: "最小长度",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "message",
      title: "校验文本",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "validator",
      title: "表单校验方法",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
