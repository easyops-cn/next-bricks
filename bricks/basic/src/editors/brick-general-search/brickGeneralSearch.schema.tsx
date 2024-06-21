export const brickGeneralSearchSchema = {
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
      name: "categoryTitle_basic",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "基础",
        },
      },
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
    },
    {
      name: "q",
      title: "回填文本",
      type: "string",
    },
    {
      name: "shouldTrimQuery",
      title: "自动去除输入的首尾空格",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
    },
    {
      name: "disableAutofocus",
      title: "禁用自动聚焦",
      type: "boolean",
    },
    {
      name: "allowClear",
      title: "支持清空",
      type: "boolean",
    },
    {
      name: "searchTypeEnabled",
      title: "支持切换搜索类型",
      type: "boolean",
      "x-reactions": [
        {
          target: "searchType",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "searchType",
      title: "默认搜索类型",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "全文搜索",
          value: "all",
        },
        {
          label: "IP搜索",
          value: "ip",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "all",
        },
      },
    },
    {
      name: "debounceTime",
      title: "搜索延迟时间",
      decorator: "FormItem",
      type: "number",
      component: {
        name: "NumberPicker",
        props: {
          placeholder: "0",
        },
      },
    },
    {
      name: "shouldUpdateUrlParams",
      title: "更新URL",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
      "x-reactions": [
        {
          target: "qField",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "qField",
      title: "更新到URL上的Key值",
      type: "string",
      component: {
        props: {
          placeholder: "q",
        },
      },
    },
    {
      name: "defaultArgs",
      title: "搜索重置默认参数",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "categoryTitle_basic",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "样式",
        },
      },
    },
    {
      name: "size",
      title: "尺寸大小",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "超大",
          value: "extraLarge",
        },
        {
          label: "大",
          value: "large",
        },
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
          defaultValue: "default",
        },
      },
    },
    {
      name: "shape",
      title: "形状",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "默认",
          value: "default",
        },
        {
          label: "圆角",
          value: "round",
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
    {
      name: "inputStyle",
      title: "输入框样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "buttonStyle",
      title: "按钮样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
