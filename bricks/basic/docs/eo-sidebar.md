---
tagName: eo-sidebar
displayName: WrappedEoSidebar
description: 侧边栏 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
---

# eo-sidebar

> 侧边栏 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：此构件已迁移至 `nav` 构件包，`basic` 构件包中将不再更新。

## Props

| 属性            | 类型                               | 必填 | 默认值    | 说明                               |
| --------------- | ---------------------------------- | ---- | --------- | ---------------------------------- |
| menu            | `SidebarMenuType`                  | 是   | -         | 菜单数据                           |
| expandedState   | `ExpandedState \| undefined`       | 否   | -         | 侧栏状态                           |
| hiddenFixedIcon | `boolean \| undefined`             | 否   | -         | 是否隐藏固定按钮                   |
| position        | `"static" \| "fixed" \| undefined` | 否   | `"fixed"` | 设置定位方式：静态定位或固定定位。 |

## Events

| 事件                  | detail                     | 说明               |
| --------------------- | -------------------------- | ------------------ |
| actual.width.change   | `number` — 当前宽度        | 宽度变化时触发     |
| expanded.state.change | `ExpandedState` — 侧栏状态 | 侧栏状态变化时触发 |

## Examples

### Basic

展示基本侧边栏，包含菜单数据和展开/折叠状态控制。

```yaml preview minHeight="300px"
brick: eo-sidebar
properties:
  menu:
    title: 我的应用
    menuItems:
      - text: 概览
        to: /overview
        key: overview
      - text: 资源
        key: resources
        items:
          - text: 主机
            to: /host
            key: resources.host
          - text: 数据库
            to: /database
            key: resources.database
      - text: 设置
        to: /settings
        key: settings
events:
  actual.width.change:
    - action: console.log
  expanded.state.change:
    - action: console.log
```

### Static Position

设置 position 为 static，侧边栏使用静态定位。

```yaml preview minHeight="300px"
brick: eo-sidebar
properties:
  position: static
  hiddenFixedIcon: false
  expandedState: expanded
  menu:
    title: 我的应用
    menuItems:
      - text: 概览
        to: /overview
        key: overview
      - text: 资源
        key: resources
        items:
          - text: 主机
            to: /host
            key: resources.host
          - text: 数据库
            to: /database
            key: resources.database
```
