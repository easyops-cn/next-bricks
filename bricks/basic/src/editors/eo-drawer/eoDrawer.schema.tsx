export const eoDrawerSchema = {
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
      name: "customTitle",
      title: "标题",
      type: "string",
    },
    {
      name: "placement",
      title: "抽屉方向",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "左",
          value: "left",
        },
        {
          label: "右",
          value: "right",
        },
        {
          label: "上",
          value: "top",
        },
        {
          label: "下",
          value: "bottom",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "right",
        },
      },
      "x-reactions": [
        {
          target: "width",
          fulfill: {
            state: {
              visible: "{{$self.value=='left'||$self.value=='right'}}",
            },
          },
        },
        {
          target: "height",
          fulfill: {
            state: {
              visible: "{{$self.value=='top'||$self.value=='bottom'}}",
            },
          },
        },
      ],
    },
    {
      name: "width",
      title: "宽度",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
    },
    {
      name: "height",
      title: "高度",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
    },
    {
      name: "visible",
      title: "显示抽屉",
      type: "boolean",
    },
    {
      name: "footerSlot",
      title: "支持footer插槽",
      type: "boolean",
    },
    {
      name: "mask",
      title: "显示蒙层",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
      "x-reactions": [
        {
          target: "maskClosable",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "maskClosable",
      title: "点击蒙层允许关闭",
      type: "boolean",
    },
    {
      name: "closable",
      title: "显示右上角关闭按钮",
      type: "boolean",
    },
    {
      name: "scrollToTopWhenOpen",
      title: "打开抽屉时内容区自动滚动到顶部",
      type: "boolean",
    },
    {
      name: "maskStyle",
      title: "蒙层样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
