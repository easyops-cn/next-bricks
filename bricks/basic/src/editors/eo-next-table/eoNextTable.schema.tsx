export const eoNextTableSchema = {
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
      name: "dataSource",
      title: "选择数据",
      type: "string",
      required: true,
      component: {
        name: "Select",
        props: {
          placeholder: "请选择数据",
          allowClear: true,
        },
      },
    },
    {
      name: "columns",
      title: "表格列配置",
      type: "string",
      required: true,
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "扩展自antd的table Column相关配置项",
        },
      },
    },
    {
      type: "string",
      name: "rowKey",
      required: true,
      title: "表格行key",
      component: {
        name: "Select",
        props: {
          placeholder: "index",
          allowClear: true,
        },
      },
    },
    {
      name: "categoryTitle_search",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "搜索",
        },
      },
    },
    {
      name: "frontSearch",
      title: "使用前端搜索",
      type: "boolean",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      "x-reactions": [
        {
          target: "searchFields",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "searchFields",
      title: "搜索目标字段",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip:
            "支持嵌套的写法,不配置的时候默认为对所有column.dataIndex进行前端搜索",
        },
      },
    },
    {
      name: "categoryTitle_page",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "页设置",
        },
      },
    },
    {
      name: "isPagination",
      title: "显示分页",
      type: "boolean",
      component: {
        props: {
          defaultValue: true,
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "pagination",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "pagination",
      title: "分页配置",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "前端搜索时需设置column.sortPriority优先级",
        },
      },
    },
    {
      name: "categoryTitle_select",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "选择",
        },
      },
    },
    {
      name: "rowSelection",
      title: "表格行可选配置",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
    },
    {
      name: "selectedRowKeys",
      title: "指定选中行",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "填入key",
        },
      },
    },
    {
      name: "categoryTitle_sort",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "排序",
        },
      },
    },
    {
      name: "multiSort",
      title: "支持多列排序",
      type: "boolean",
    },
    {
      name: "sort",
      title: "排序配置",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
    },
    {
      name: "categoryTitle_expand",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "展开与树形展示",
        },
      },
    },
    {
      name: "expandable",
      title: "表格行展开配置",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
    },
    {
      name: "expandedRowKeys",
      title: "展开项的key",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
    },
    {
      name: "childrenColumnName",
      title: "树形结构列名",
      type: "string",
      component: {
        props: {
          placeholder: "children",
        },
      },
    },
    {
      name: "categoryTitle_style",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "外观",
        },
      },
    },
    {
      name: "size",
      title: "表格大小",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "S",
          value: "small",
        },
        {
          label: "M",
          value: "middle",
        },
        {
          label: "L",
          value: "large",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "large",
        },
      },
    },
    {
      name: "showHeader",
      title: "显示表头",
      type: "boolean",
      component: {
        props: {
          defaultValue: true,
          size: "small",
        },
      },
    },
    {
      name: "hiddenColumns",
      title: "隐藏表格列",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "填入column.key",
        },
      },
    },
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
      name: "scrollConfig",
      title: "表格滚动配置",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
    },
    {
      name: "rowDraggable",
      title: "支持表格行拖拽",
      type: "boolean",
      component: {
        props: {
          size: "small",
        },
      },
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
    },
    {
      name: "categoryTitle_advanced",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "高级",
        },
      },
    },
    {
      name: "optimizedColumns",
      title: "需优化渲染的列",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "输入对应的column.key",
        },
      },
    },
  ],
};
