---
tagName: eo-sidebar-menu-item
displayName: WrappedEoSidebarMenuItem
description: 侧栏菜单项 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# WrappedEoSidebarMenuItem

> 侧栏菜单项 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃**：该构件已迁移至 `nav` 构件包，请使用新版侧栏菜单构件。

## 导入

```tsx
import { WrappedEoSidebarMenuItem } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型                  | 必填 | 默认值 | 说明                     |
| ------------- | --------------------- | ---- | ------ | ------------------------ |
| url           | `LinkProps["url"]`    | 否   | -      | 菜单项对应的系统内地址   |
| href          | `LinkProps["href"]`   | 否   | -      | 菜单项对应的外部链接地址 |
| target        | `LinkProps["target"]` | 否   | -      | 菜单项链接打开的目标     |
| icon          | `GeneralIconProps`    | 否   | -      | 菜单项的图标             |
| selected      | `boolean`             | 否   | -      | 是否选中                 |
| menuCollapsed | `boolean`             | 否   | -      | 菜单整体是否收起状态     |

## Examples

### Basic

展示基本菜单项，设置图标和文本内容。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuItem
    icon={{ lib: "antd", icon: "home" }}
    selected={false}
  >
    <span>首页</span>
  </WrappedEoSidebarMenuItem>
  <WrappedEoSidebarMenuItem
    icon={{ lib: "antd", icon: "setting" }}
    selected={true}
  >
    <span>设置</span>
  </WrappedEoSidebarMenuItem>
</WrappedEoSidebarMenu>
```

### With Link

通过 `url` 或 `href` 设置菜单项跳转链接。

```tsx
<WrappedEoSidebarMenu>
  <WrappedEoSidebarMenuItem icon={{ lib: "antd", icon: "link" }} url="/home">
    <span>内部链接</span>
  </WrappedEoSidebarMenuItem>
  <WrappedEoSidebarMenuItem
    icon={{ lib: "antd", icon: "global" }}
    href="https://www.example.com"
    target="_blank"
  >
    <span>外部链接</span>
  </WrappedEoSidebarMenuItem>
</WrappedEoSidebarMenu>
```
