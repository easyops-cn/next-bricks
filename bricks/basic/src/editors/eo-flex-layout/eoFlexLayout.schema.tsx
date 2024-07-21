export const eoFlexLayoutSchema = {
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
      name: "flexDirection",
      title: "主轴方向",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "row",
              value: "row",
            },
            {
              label: "column",
              value: "column",
            },
            {
              label: "row-reverse",
              value: "row-reverse",
            },
            {
              label: "column-reverse",
              value: "column-reverse",
            },
          ],
        },
      },
    },
    {
      name: "justifyContent",
      title: "主轴排列方式",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "flex-start",
              value: "flex-start",
            },
            {
              label: "flex-end",
              value: "flex-end",
            },
            {
              label: "space-between",
              value: "space-between",
            },
            {
              label: "space-around",
              value: "space-around",
            },
            {
              label: "space-evenly",
              value: "space-evenly",
            },
            {
              label: "stretch",
              value: "stretch",
            },
          ],
        },
      },
    },
    {
      name: "alignItems",
      title: "单行交叉轴排列方式",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "flex-start",
              value: "flex-start",
            },
            {
              label: "flex-end",
              value: "flex-end",
            },
          ],
        },
      },
    },
    {
      name: "alignContent",
      title: "多行交叉轴排列方式",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "flex-start",
              value: "flex-start",
            },
            {
              label: "flex-end",
              value: "flex-end",
            },
            {
              label: "space-between",
              value: "space-between",
            },
            {
              label: "space-around",
              value: "space-around",
            },
            {
              label: "space-evenly",
              value: "space-evenly",
            },
            {
              label: "stretch",
              value: "stretch",
            },
          ],
        },
      },
    },
    {
      name: "flexWrap",
      title: "支持换行",
      type: "boolean",
    },
    {
      name: "gap",
      title: "子元素间隙",
      type: "string",
    },
  ],
};
