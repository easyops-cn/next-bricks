export const eoTextareaSchema = {
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
          text: "文本框",
        },
      },
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
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
      name: "autoSize",
      title: "大小自适应设置",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "textareaStyle",
      title: "输入框样式",
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
  ],
};
