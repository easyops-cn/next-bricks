---
tagName: eo-sidebar-menu-group
displayName: WrappedEoSidebarMenuGroup
description: 侧栏菜单分组 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# WrappedEoSidebarMenuGroup

> 侧栏菜单分组 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## 导入

```tsx
import { WrappedEoSidebarMenuGroup } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型      | 必填 | 默认值 | 说明                 |
| ------------- | --------- | ---- | ------ | -------------------- |
| collapsable   | `boolean` | 是   | `true` | 是否允许折叠         |
| collapsed     | `boolean` | 否   | -      | 是否折叠             |
| selected      | `boolean` | 否   | -      | 是否选中             |
| menuCollapsed | `boolean` | 否   | -      | 菜单整体是否收起状态 |

## Slots

| 名称  | 说明     |
| ----- | -------- |
| title | 分组标题 |

## Examples

### Basic

展示可折叠的菜单分组，通过 `title` 插槽设置分组标题。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuGroup>
    <span slot="title">资源管理</span>
    <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "database" }}>
      <span>主机</span>
    </WrappedEoSidebarMenuItem>
    <WrappedEoSidebarMenuItem
      icon={{ lib: "antd", icon: "cloud" }}
      selected={true}
    >
      <span>云主机</span>
    </WrappedEoSidebarMenuItem>
  </WrappedEoSidebarMenuGroup>
</WrappedEoSidebarMenu>
```

### Non-collapsable

设置 `collapsable` 为 `false` 禁止分组折叠。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuGroup collapsable={false} selected={true}>
    <span slot="title">固定分组</span>
    <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "file" }}>
      <span>文档管理</span>
    </WrappedEoSidebarMenuItem>
  </WrappedEoSidebarMenuGroup>
</WrappedEoSidebarMenu>
```

### Pre-collapsed

设置 `collapsed` 为 `true` 使分组默认处于折叠状态。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuGroup collapsed={true}>
    <span slot="title">高级设置</span>
    <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "tool" }}>
      <span>高级配置</span>
    </WrappedEoSidebarMenuItem>
  </WrappedEoSidebarMenuGroup>
</WrappedEoSidebarMenu>
```
