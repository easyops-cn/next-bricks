export const eoModalSchema = {
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
      name: "modalTitle",
      title: "标题",
      type: "string",
    },
    {
      name: "width",
      title: "模态框宽度",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
    },
    {
      name: "visible",
      title: "显示模态框",
      type: "boolean",
    },
    {
      name: "maskClosable",
      title: "点击蒙层可关闭弹框",
      type: "boolean",
      component: {
        props: {
          size: "small",
        },
      },
    },
    {
      name: "fullscreen",
      title: "启用全屏模式",
      type: "boolean",
    },
    {
      name: "categoryTitle_confirm",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "确定按钮",
        },
      },
    },
    {
      name: "confirmText",
      title: "确定按钮文字",
      type: "string",
      component: {
        props: {
          placeholder: "确定",
        },
      },
    },
    {
      name: "confirmDisabled",
      title: "禁用确定按钮",
      type: "boolean",
    },
    {
      name: "closeWhenConfirm",
      title: "确定时自动关闭弹框",
      type: "boolean",
      decorator: {
        props: {
          tooltip: "值为false时，点击确定后需要自行关闭弹框",
        },
      },
      component: {
        props: {
          defaultValue: true,
        },
      },
    },
    {
      name: "categoryTitle_cancel",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "取消按钮",
        },
      },
    },
    {
      name: "cancelText",
      title: "取消按钮文字",
      type: "string",
      component: {
        props: {
          placeholder: "取消",
        },
      },
    },
    {
      name: "hideCancelButton",
      title: "隐藏取消按钮",
      type: "boolean",
    },
  ],
};
