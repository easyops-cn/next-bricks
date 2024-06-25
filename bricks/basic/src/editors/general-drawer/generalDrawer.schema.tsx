export const generalDrawerSchema = {
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
      name: "hasFooter",
      title: "支持footer插槽",
      type: "boolean",
    },
    {
      name: "width",
      title: "宽度",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
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
      name: "loading",
      title: "显示加载中效果",
      type: "boolean",
    },
    {
      name: "isFloat",
      title: "浮层样式",
      type: "boolean",
    },
    {
      name: "scrollToTopWhenOpen",
      title: "打开抽屉时内容区自动滚动到顶部",
      type: "boolean",
    },
    {
      name: "bodyStyle",
      title: "抽屉内容样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "drawerStyle",
      title: "抽屉弹出层样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "headerStyle",
      title: "抽屉头部样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "configProps",
      title: "其他设置",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "直接透传给antd的Drawer属性",
        },
      },
    },
  ],
};
