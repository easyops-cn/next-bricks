---
tagName: eo-menu-item-sub-menu
displayName: WrappedEoMenuItemSubMenu
description: 菜单子菜单构件，点击标题可折叠或展开子菜单内容
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoMenuItemSubMenu

> 菜单子菜单构件，点击标题可折叠或展开子菜单内容

## 导入

```tsx
import { WrappedEoMenuItemSubMenu } from "@easyops/wrapped-components";
```

## Props

| 属性       | 类型                  | 必填 | 默认值 | 说明                                                 |
| ---------- | --------------------- | ---- | ------ | ---------------------------------------------------- |
| icon       | `GeneralIconProps`    | 否   | -      | 标题区域的图标                                       |
| titleStyle | `React.CSSProperties` | 否   | -      | 标题区域的自定义样式                                 |
| bodyStyle  | `React.CSSProperties` | 否   | -      | 内容区域的自定义样式                                 |
| collapsed  | `boolean`             | 否   | `true` | 是否为折叠状态，折叠时隐藏子菜单内容，默认为折叠状态 |

## Slots

| 名称      | 说明                     |
| --------- | ------------------------ |
| title     | 子菜单标题内容           |
| (default) | 子菜单内容，通常为菜单项 |

## CSS Parts

| 名称                | 说明           |
| ------------------- | -------------- |
| sub-menu-item       | 外层容器       |
| sub-menu-item-title | 子菜单标题容器 |
| menu-item-icon      | 标题图标       |
| sub-menu-item-arrow | 折叠箭头指示器 |

## Examples

### Basic

子菜单基本用法，默认处于折叠状态，点击标题可展开或收起。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuItemSubMenu collapsed={false}>
    <span slot="title">系统管理</span>
    <WrappedEoMenuItem active>用户管理</WrappedEoMenuItem>
    <WrappedEoMenuItem>角色管理</WrappedEoMenuItem>
  </WrappedEoMenuItemSubMenu>
  <WrappedEoMenuItemSubMenu>
    <span slot="title">数据中心</span>
    <WrappedEoMenuItem>数据源</WrappedEoMenuItem>
    <WrappedEoMenuItem>数据集</WrappedEoMenuItem>
  </WrappedEoMenuItemSubMenu>
</WrappedEoMenu>
```

### With Icons

子菜单标题配置图标，图标显示在标题文字前方。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuItemSubMenu
    collapsed={false}
    icon={{ lib: "antd", icon: "setting" }}
  >
    <span slot="title">系统管理</span>
    <WrappedEoMenuItem>用户管理</WrappedEoMenuItem>
    <WrappedEoMenuItem>角色管理</WrappedEoMenuItem>
  </WrappedEoMenuItemSubMenu>
</WrappedEoMenu>
```

### Custom Styles

通过 `titleStyle` 和 `bodyStyle` 自定义标题和内容区域样式。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuItemSubMenu
    collapsed={false}
    titleStyle={{ fontWeight: "bold", color: "#1890ff" }}
    bodyStyle={{ paddingLeft: "16px" }}
  >
    <span slot="title">自定义样式分组</span>
    <WrappedEoMenuItem>子菜单项 A</WrappedEoMenuItem>
    <WrappedEoMenuItem>子菜单项 B</WrappedEoMenuItem>
  </WrappedEoMenuItemSubMenu>
</WrappedEoMenu>
```
