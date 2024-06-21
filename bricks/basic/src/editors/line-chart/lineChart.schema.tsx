export const lineChartSchema = {
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
          text: "数据",
        },
      },
    },
    {
      name: "data",
      title: "选择数据",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
      required: true,
    },
    {
      type: "string",
      title: "选择x轴",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择x轴",
          allowClear: true,
          options: [].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "doubleYaxis",
      title: "是否双y轴",
      type: "boolean",
    },
    {
      type: "string",
      title: "左Y轴",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择x轴",
          allowClear: true,
          options: [].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },

    {
      name: "componentType",
      title: "标签类型",
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
          value: "Tag",
        },
        {
          label: "可选标签",
          value: "CheckableTag",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "Tag",
        },
      },
      "x-reactions": [
        {
          target: "multipleCheck",
          fulfill: {
            state: {
              visible: "{{$self.value==='CheckableTag'}}",
            },
          },
        },
        {
          dependencies: ["multipleCheck"],
          target: "cancelable",
          fulfill: {
            state: {
              visible: "{{$self.value==='CheckableTag'&&$deps[0]===false}}",
            },
          },
        },
        {
          target: "default",
          fulfill: {
            state: {
              visible: "{{$self.value==='CheckableTag'}}",
            },
          },
        },
        {
          dependencies: ["closable"],
          target: "color",
          fulfill: {
            state: {
              visible: "{{$self.value==='Tag'&&$deps[0]===false}}",
            },
          },
        },
        {
          target: "configProps",
          fulfill: {
            state: {
              visible: "{{$self.value==='Tag'}}",
            },
          },
        },
      ],
    },
    {
      name: "tagList",
      title: "标签列表",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "multipleCheck",
      title: "允许多选",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
      "x-reactions": [
        {
          dependencies: ["componentType"],
          target: "cancelable",
          fulfill: {
            state: {
              visible: "{{$self.value===false&&$deps[0]==='checkableTag'}}",
            },
          },
        },
      ],
    },
    {
      name: "cancelable",
      title: "允许取消选中",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
    },
    {
      name: "default",
      title: "默认值",
      type: "string",
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
      name: "showTagCircle",
      title: "标签内显示圆点",
      type: "boolean",
    },
    {
      name: "showCard",
      title: "显示卡片容器",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
    },
    {
      name: "closable",
      title: "允许关闭",
      type: "boolean",
      "x-reactions": [
        {
          dependencies: ["componentType"],
          target: "color",
          fulfill: {
            state: {
              visible: "{{$self.value===false&&$deps[0]==='Tag'}}",
            },
          },
        },
      ],
    },
    {
      name: "textEllipsis",
      title: "是否溢出省略",
      type: "boolean",
    },
    {
      name: "label",
      title: "文案",
      type: "string",
    },
    {
      name: "color",
      title: "颜色",
      type: "string",
    },
    {
      name: "tagStyle",
      title: "自定义样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "tagCheckedStyle",
      title: "选中自定义样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "tagHoverStyle",
      title: "悬浮自定义样式",
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
          text: "其他",
        },
      },
    },
    {
      name: "disabledTooltip",
      title: "禁用提示",
      type: "string",
    },
    {
      name: "tooltipProps",
      title: "提示配置",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "configProps",
      title: "额外配置",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "afterBrick",
      title: "尾部插入构件",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
