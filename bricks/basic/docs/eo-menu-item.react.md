---
tagName: eo-menu-item
displayName: WrappedEoMenuItem
description: 菜单项构件，支持图标、选中和禁用状态
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoMenuItem

> 菜单项构件，支持图标、选中和禁用状态

## 导入

```tsx
import { WrappedEoMenuItem } from "@easyops/wrapped-components";
```

## Props

| 属性     | 类型               | 必填 | 默认值 | 说明                             |
| -------- | ------------------ | ---- | ------ | -------------------------------- |
| icon     | `GeneralIconProps` | 否   | -      | 图标                             |
| active   | `boolean`          | 否   | -      | 是否选中                         |
| disabled | `boolean`          | 否   | -      | 是否禁用，禁用后阻止点击事件传播 |

## Slots

| 名称      | 说明       |
| --------- | ---------- |
| (default) | 菜单项内容 |

## CSS Parts

| 名称           | 说明       |
| -------------- | ---------- |
| menu-item      | 外层容器   |
| menu-item-icon | 菜单项图标 |

## Examples

### Basic

基本菜单项用法，展示普通、选中和禁用状态。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuItem active>首页</WrappedEoMenuItem>
  <WrappedEoMenuItem>关于</WrappedEoMenuItem>
  <WrappedEoMenuItem disabled>设置</WrappedEoMenuItem>
</WrappedEoMenu>
```

### With Icons

菜单项配置图标，图标位于文字前方显示。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuItem active icon={{ lib: "antd", icon: "dashboard" }}>
    仪表盘
  </WrappedEoMenuItem>
  <WrappedEoMenuItem icon={{ lib: "antd", icon: "user" }}>
    用户管理
  </WrappedEoMenuItem>
  <WrappedEoMenuItem icon={{ lib: "antd", icon: "setting" }} disabled>
    系统设置
  </WrappedEoMenuItem>
</WrappedEoMenu>
```
