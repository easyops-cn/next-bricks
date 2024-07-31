export const tplPageLayoutSchema = {
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
      name: "pageTitle",
      title: "页面标题",
      type: "string",
    },
    {
      name: "menu",
      title: "顶栏菜单配置",
      type: "string",
    },
    {
      name: "showSidebar",
      title: "是否展示侧边栏",
      type: "boolean",
      "x-reactions": [
        {
          target: "sidebarMenu",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "sidebarMenu",
      title: "侧边栏配置",
      type: "string",
      component: {
        name: "CodeEditor",
      },
    },
    {
      name: "showSubSidebar",
      title: "子侧边栏菜单",
      type: "boolean",
      "x-reactions": [
        {
          target: "subSidebarMenu",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "subSidebarMenu",
      title: "子侧边栏配置",
      type: "string",
      component: {
        name: "CodeEditor",
      },
    },
    {
      name: "showBreadcrumb",
      title: "是否展示面包屑",
      type: "boolean",
    },
    {
      name: "breadcrumb",
      title: "面包屑",
      type: "string",
      component: "CodeEditor",
    },
    {
      name: "bannerAlone",
      type: "boolean",
      title: "独立 banner",
      decorator: {
        props: {
          tooltip: "启用时不显示默认的页面标题和面包屑",
          layout: "horizontal",
        },
      },
      component: {
        name: "Switch",
        props: {
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "bannerTitle",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
        {
          target: "bannerDescription",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
        {
          target: "bannerImage",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
        {
          target: "bannerSunk",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "bannerTitle",
      type: "string",
      title: "Banner 标题",
    },
    {
      name: "bannerDescription",
      type: "string",
      title: "Banner 描述",
    },
    {
      name: "bannerImage",
      type: "string",
      title: "Banner 图片",
    },
    {
      name: "bannerSunk",
      type: "boolean",
      title: "Banner 下沉",
    },
    {
      name: "narrow",
      type: "string",
      title: "使用窄布局",
      component: {
        name: "Select",
        props: {
          options: ["small", "medium", "large", "full"].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "fillContainer",
      type: "boolean",
      title: "填满容器",
    },
    {
      name: "contentGap",
      type: "string",
      title: "内容间距大小",
      component: {
        name: "Select",
        props: {
          options: ["small", "medium"].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "showFooter",
      type: "boolean",
      title: "是否显示底栏",
      "x-reactions": [
        {
          target: "fixedFooter",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "fixedFooter",
      type: "boolean",
      title: "底栏是否始终固定在底部",
    },
  ],
};
