---
tagName: eo-sidebar-sub-menu
displayName: WrappedEoSidebarSubMenu
description: 构件 `eo-sidebar-sub-menu` 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoSidebarSubMenu

> 构件 `eo-sidebar-sub-menu` 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：此构件已迁移至 `nav` 构件包，`basic` 构件包中将不再更新。

## 导入

```tsx
import { WrappedEoSidebarSubMenu } from "@easyops/wrapped-components";
```

## Props

| 属性 | 类型                       | 必填 | 默认值 | 说明   |
| ---- | -------------------------- | ---- | ------ | ------ |
| menu | `SidebarMenu \| undefined` | 否   | -      | 菜单项 |

## Examples

### Basic

展示侧边栏子菜单，支持简单菜单项、子菜单分组和菜单组。

```tsx
<WrappedEoSidebarSubMenu
  menu={{
    title: "资源管理",
    menuItems: [
      { text: "主机", to: "/host", key: "host" },
      {
        title: "网络",
        key: "network",
        items: [
          { text: "交换机", to: "/switch", key: "network.switch" },
          { text: "路由器", to: "/router", key: "network.router" },
        ],
      },
      {
        title: "存储分组",
        key: "storage-group",
        type: "group",
        items: [
          { text: "磁盘", to: "/disk", key: "storage-group.disk" },
          { text: "存储池", to: "/pool", key: "storage-group.pool" },
        ],
      },
    ],
  }}
/>
```
