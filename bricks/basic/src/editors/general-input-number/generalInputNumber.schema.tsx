export const generalInputNumberSchema = {
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
          text: "数字文本框",
        },
      },
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
    },
    {
      name: "min",
      title: "最小值",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "max",
      title: "最大值",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "step",
      title: "数字输入框步长",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "precision",
      title: "数值精度",
      type: "number",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
    },
    {
      name: "inputBoxStyle",
      title: "输入框样式",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
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
      name: "pattern",
      title: "正则校验规则",
      type: "string",
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
    {
      name: "validator",
      title: "表单校验方法",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
