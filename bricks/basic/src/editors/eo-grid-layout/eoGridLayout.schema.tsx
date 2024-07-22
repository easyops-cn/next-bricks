export const eoGridLayoutSchema = {
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
      name: "columns",
      title: "列数",
      type: "number",
      component: "NumberPicker",
      decorator: {
        name: "FormItem",
        props: {
          tooltip: "各列等宽",
        },
      },
    },
    {
      name: "rows",
      title: "行数",
      type: "number",
      component: {
        name: "NumberPicker",
        props: {
          placeholder: "1",
        },
      },
      decorator: {
        name: "FormItem",
        props: {
          tooltip: "通常不需设置，各行高度由内容决定。设置为>1时，各行高度相同",
        },
      },
    },
    {
      name: "columnSpan",
      title: "在父级网格中占列数",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
    },
    {
      name: "rowSpan",
      title: "在父级网格中占行数",
      type: "number",
      component: {
        name: "NumberPicker",
        props: {
          placeholder: "1",
        },
      },
      decorator: "FormItem",
    },
    {
      name: "templateColumns",
      title: "模板列",
      type: "string",
      decorator: {
        props: {
          tooltip: "对应css的grid-template-columns属性，优先于columns",
        },
      },
    },
    {
      name: "alignItems",
      title: "单元格的垂直位置",
      type: "string",
      decorator: {
        props: {
          tooltip: "对应css的align-items属性",
        },
      },
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "start",
              value: "start",
            },
            {
              label: "end",
              value: "end",
            },
          ],
        },
      },
    },
    {
      name: "alignContent",
      title: "整个内容区的垂直位置",
      type: "string",
      decorator: {
        props: {
          tooltip: "对应css的align-content属性",
        },
      },
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "start",
              value: "start",
            },
            {
              label: "end",
              value: "end",
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
      name: "justifyItems",
      title: "单元格内容的水平位置",
      type: "string",
      decorator: {
        props: {
          tooltip: "对应css的justify-items属性",
        },
      },
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "start",
              value: "start",
            },
            {
              label: "end",
              value: "end",
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
      name: "justifyContent",
      title: "整个内容区在容器中的水平位置",
      type: "string",
      decorator: {
        props: {
          tooltip: "对应css的justify-content属性",
        },
      },
      component: {
        name: "Select",
        props: {
          options: [
            {
              label: "center",
              value: "center",
            },
            {
              label: "start",
              value: "start",
            },
            {
              label: "end",
              value: "end",
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
      name: "autoFlow",
      title: "子元素自动排布顺序",
      type: "string",
      decorator: {
        props: {
          tooltip: "对应css的grid-auto-flow属性",
        },
      },
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
          ],
        },
      },
    },
    {
      name: "responsive",
      title: "响应式布局设置",
      type: "string",
      component: {
        name: "CodeEditor",
        props: {
          placeholder: "写法如下：\nmedium:\n  columns: 1",
        },
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "gap",
      title: "子元素间距",
      type: "string",
      component: {
        props: {
          placeholder: "var(--page-card-gap)",
        },
      },
    },
    {
      name: "showGridBorder",
      title: "显示边框",
      type: "boolean",
      "x-reactions": [
        {
          target: "gridBorderColor",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "gridBorderColor",
      title: "边框颜色",
      type: "string",
      component: "ColorPicker",
    },
  ],
};
