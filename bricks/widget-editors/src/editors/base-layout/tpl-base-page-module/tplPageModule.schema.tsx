export const tplPageModuleSchema = {
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
      name: "appName",
      title: "app名称",
      type: "string",
    },
    {
      name: "appUrl",
      title: "app跳转链接",
      type: "string",
    },
    {
      name: "menu",
      title: "顶栏菜单配置",
      type: "string",
    },
    {
      name: "isHiddenSideBar",
      title: "是否隐藏侧边栏",
      type: "boolean",
      component: {
        name: "Switch",
        props: {
          defaultValue: false,
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "sideBarMenu",
          fulfill: {
            state: {
              visible: "{{!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "sideBarMenu",
      title: "侧边栏配置",
      type: "string",
      component: {
        name: "CodeEditor",
      },
    },
    {
      name: "showSubSidebarMenu",
      title: "是否展示子侧边栏菜单",
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
      name: "isShowBreadcrumb",
      title: "是否展示面包屑",
      type: "boolean",
      "x-reactions": [
        {
          target: "breadcrumb",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "breadcrumb",
      title: "面包屑",
      type: "string",
      component: "CodeEditor",
    },
    {
      name: "isHiddenNavBar",
      title: "是否隐藏顶栏",
      type: "boolean",
    },
    {
      name: "isInCMDB",
      title: "是否为CMDB资源大菜单",
      type: "boolean",
    },
    {
      name: "displayCenter",
      title: "是否居中",
      type: "boolean",
    },
    {
      name: "isFixed",
      title: "导航栏是否启动 fixed 布局",
      type: "boolean",
      component: {
        name: "Switch",
        props: {
          defaultValue: true,
          size: "small",
        },
      },
    },
    {
      name: "isShowLogo",
      title: "是否展示logo",
      type: "boolean",
      component: {
        name: "Switch",
        props: {
          defaultValue: true,
          size: "small",
        },
      },
    },
    {
      name: "isShowAppName",
      title: "是否展示 app 名称",
      type: "boolean",
      component: {
        name: "Switch",
        props: {
          defaultValue: true,
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "appName",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "isShowLaunchpadButton",
      title: "是否展示 launchpad 按钮",
      type: "boolean",
      component: {
        name: "Switch",
        props: {
          defaultValue: true,
          size: "small",
        },
      },
    },
  ],
};
