---
tagName: eo-sidebar-menu
displayName: WrappedEoSidebarMenu
description: 侧栏菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# WrappedEoSidebarMenu

> 侧栏菜单 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## 导入

```tsx
import { WrappedEoSidebarMenu } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型      | 必填 | 默认值 | 说明                 |
| ------------- | --------- | ---- | ------ | -------------------- |
| menuCollapsed | `boolean` | 否   | -      | 菜单整体是否收起状态 |

## Examples

### Basic

使用 `WrappedEoSidebarMenu` 包裹菜单项，构成完整侧栏菜单。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "home" }}>
    <span>首页</span>
  </WrappedEoSidebarMenuItem>
  <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "setting" }} selected>
    <span>设置</span>
  </WrappedEoSidebarMenuItem>
</WrappedEoSidebarMenu>
```

### Collapsed

设置 `menuCollapsed` 为 `true` 收起菜单，仅显示图标。

```tsx
<WrappedEoSidebarMenu menuCollapsed={true}>
  <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "home" }}>
    <span>首页</span>
  </WrappedEoSidebarMenuItem>
  <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "setting" }}>
    <span>设置</span>
  </WrappedEoSidebarMenuItem>
</WrappedEoSidebarMenu>
```
