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
      required: true,
      component: {
        name: "Select",
        props: {
          placeholder: "请选择数据",
          allowClear: true,
          options: [],
        },
      },
    },
    {
      type: "string",
      name: "xField",
      required: true,
      title: "选择X轴",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择X轴",
          allowClear: true,
          options: [],
        },
      },
    },
    {
      name: "doubleYaxis",
      title: "是否双Y轴",
      type: "boolean",
      "x-reactions": [
        {
          target: "leftYField",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "rightYField",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "categoryTitle_yAxisRight",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "rightYFieldPrecision",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "rightYFieldUnit",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "rightYFieldShape",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "rightYFieldMax",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "rightYFieldMin",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "yField",
          fulfill: {
            state: {
              visible: "{{!$self.value}}",
            },
          },
        },
      ],
    },
    {
      type: "string",
      title: "左Y轴",
      name: "leftYField",
      required: true,
      component: {
        name: "Select",
        props: {
          placeholder: "请选择左Y轴",
          allowClear: true,
          options: [],
        },
      },
    },
    {
      type: "string",
      title: "右Y轴",
      name: "rightYField",
      required: true,
      component: {
        name: "Select",
        props: {
          placeholder: "请选择右Y轴",
          allowClear: true,
          options: [],
        },
      },
    },
    {
      type: "string",
      title: "选择Y轴",
      name: "yField",
      required: true,
      component: {
        name: "Select",
        props: {
          placeholder: "请选择Y轴",
          allowClear: true,
          options: [],
        },
      },
    },
    {
      type: "string",
      title: "分组字段",
      name: "groupField",
      component: {
        name: "Select",
        props: {
          placeholder: "分组字段",
          allowClear: true,
          options: [],
        },
      },
    },
    {
      name: "categoryTitle_style",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "样式",
        },
      },
    },
    {
      name: "height",
      title: "高度",
      decorator: "FormItem",
      type: "number",
      required: true,
      component: "NumberPicker",
    },
    {
      name: "width",
      title: "宽度",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    {
      name: "showPoint",
      title: "是否显示数据点",
      type: "boolean",
    },
    {
      name: "connectNulls",
      title: "折线连接空值",
      type: "boolean",
    },
    {
      name: "showExportButton",
      title: "显示导出数据按钮",
      type: "boolean",
    },
    {
      name: "legends",
      title: "是否显示图例",
      type: "boolean",
      component: {
        props: {
          defaultValue: true,
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "position",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "position",
      title: "图例位置",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          allowClear: true,
          options: [
            "top",
            "top-left",
            "top-right",
            "bottom",
            "bottom-left",
            "bottom-right",
            "right",
            "right-top",
            "right-bottom",
            "left",
            "left-top",
            "left-bottom",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "fillOpacity",
      title: "折线透明度",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    {
      name: "categoryTitle_xAxis",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "X轴",
        },
      },
    },
    {
      name: "timeType",
      title: "时间类型",
      type: "boolean",
      "x-reactions": [
        {
          target: "timeFormat",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "timeFormat",
      title: "时间格式",
      type: "string",
    },
    {
      name: "xRange",
      title: "范围设置",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "categoryTitle_yAxis",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "Y轴",
        },
      },
    },
    {
      name: "precision",
      title: "小数位数",
      decorator: "FormItem",
      type: "number",
      component: {
        name: "NumberPicker",
        props: {
          placeholder: 2,
        },
      },
    },
    {
      name: "unit",
      title: "单位",
      type: "string",
    },
    {
      name: "shape",
      title: "形状",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        defaultValue: "line",
        props: {
          allowClear: true,
          options: [
            "line",
            "dot",
            "dash",
            "smooth",
            "hv",
            "vh",
            "hvh",
            "vhv",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "max",
      title: "最大值",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    {
      name: "min",
      title: "最小值",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    {
      name: "categoryTitle_yAxisRight",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "右Y轴",
        },
      },
    },
    {
      name: "rightYFieldPrecision",
      title: "小数位数",
      decorator: "FormItem",
      type: "number",
      component: {
        name: "NumberPicker",
        props: {
          placeholder: 2,
        },
      },
    },
    {
      name: "rightYFieldUnit",
      title: "单位",
      type: "string",
    },
    {
      name: "rightYFieldShape",
      title: "形状",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        defaultValue: "line",
        props: {
          allowClear: true,
          options: [
            "line",
            "dot",
            "dash",
            "smooth",
            "hv",
            "vh",
            "hvh",
            "vhv",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "rightYFieldMax",
      title: "最大值",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    {
      name: "rightYFieldMin",
      title: "最小值",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    // {
    //   name: "categoryTitle_thresholds",
    //   type: "void",
    //   decorator: {
    //     name: "CategoryTitle",
    //     props: {
    //       text: "阈值线",
    //     },
    //   },
    // },
    // {
    //   name: "thresholdsOperator",
    //   title: "比较符",
    //   type: "string",
    //   decorator: {
    //     name: "FormItem",
    //     props: {
    //       layout: "horizontal",
    //     },
    //   },
    //   enum: [
    //     {
    //       label: "大于",
    //       value: "gt",
    //     },
    //     {
    //       label: "小于",
    //       value: "lt",
    //     },
    //   ],
    //   component: {
    //     name: "Radio.Group",
    //     props: {
    //       size: "small",
    //       optionType: "button",
    //       defaultValue: "gt",
    //     },
    //   },
    // },
    // {
    //   name: "thresholdsValue",
    //   title: "阈值",
    //   decorator: "FormItem",
    //   type: "number",
    //   component: "NumberPicker",
    // },
    // {
    //   name: "thresholdsColor",
    //   title: "阈值线颜色",
    //   type: "string",
    // },
    // {
    //   name: "thresholdsFill",
    //   title: "是否显示阈值蒙层",
    //   type: "boolean",
    // },
    // {
    //   name: "thresholdsShape",
    //   title: "阈值线形状",
    //   type: "string",
    //   decorator: {
    //     name: "FormItem",
    //     props: {
    //       layout: "horizontal",
    //     },
    //   },
    //   enum: [
    //     {
    //       label: "Dash",
    //       value: "dash",
    //     },
    //     {
    //       label: "Line",
    //       value: "line",
    //     },
    //     {
    //       label: "None",
    //       value: "none",
    //     },
    //   ],
    //   component: {
    //     name: "Radio.Group",
    //     props: {
    //       size: "small",
    //       optionType: "button",
    //       defaultValue: "dash",
    //     },
    //   },
    // },
    {
      name: "categoryTitle_other",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "其他",
        },
      },
    },
    {
      name: "thresholds",
      title: "阈值线",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "marker",
      title: "呼吸点",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "interactions",
      title: "调用交互",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
