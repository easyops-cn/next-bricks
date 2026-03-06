---
tagName: eo-sidebar-menu-submenu
displayName: WrappedEoSidebarMenuSubmenu
description: 侧栏菜单子菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# WrappedEoSidebarMenuSubmenu

> 侧栏菜单子菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## 导入

```tsx
import { WrappedEoSidebarMenuSubmenu } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型               | 必填 | 默认值 | 说明                 |
| ------------- | ------------------ | ---- | ------ | -------------------- |
| icon          | `GeneralIconProps` | 否   | -      | 菜单的图标           |
| selected      | `boolean`          | 否   | -      | 是否选中             |
| collapsed     | `boolean`          | 否   | -      | 是否折叠             |
| menuCollapsed | `boolean`          | 否   | -      | 菜单整体是否收起状态 |

## Slots

| 名称  | 说明       |
| ----- | ---------- |
| title | 子菜单标题 |

## Examples

### Basic

展示可折叠的子菜单，包含标题插槽和子菜单项。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuSubmenu icon={{ lib: "antd", icon: "folder" }}>
    <span slot="title">应用管理</span>
    <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "appstore" }}>
      <span>应用列表</span>
    </WrappedEoSidebarMenuItem>
    <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "plus" }}>
      <span>新建应用</span>
    </WrappedEoSidebarMenuItem>
  </WrappedEoSidebarMenuSubmenu>
</WrappedEoSidebarMenu>
```

### Collapsed

设置 `collapsed` 为 `true` 默认折叠子菜单。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuSubmenu
    icon={{ lib: "antd", icon: "folder" }}
    collapsed={true}
    selected={true}
  >
    <span slot="title">系统管理</span>
    <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "user" }}>
      <span>用户管理</span>
    </WrappedEoSidebarMenuItem>
  </WrappedEoSidebarMenuSubmenu>
</WrappedEoSidebarMenu>
```
