---
tagName: eo-menu
displayName: WrappedEoMenu
description: 菜单构件，支持垂直和水平两种布局方式
category: navigation
source: "@next-bricks/basic"
---

# WrappedEoMenu

> 菜单构件，支持垂直和水平两种布局方式

## 导入

```tsx
import { WrappedEoMenu } from "@easyops/wrapped-components";
```

## Props

| 属性 | 类型                         | 必填 | 默认值       | 说明                                                           |
| ---- | ---------------------------- | ---- | ------------ | -------------------------------------------------------------- |
| mode | `"vertical" \| "horizontal"` | 否   | `"vertical"` | 菜单布局方式，支持垂直（vertical）和水平（horizontal）两种模式 |

## Slots

| 名称      | 说明     |
| --------- | -------- |
| (default) | 菜单内容 |

## Examples

### Vertical Menu

垂直菜单（默认模式），用于侧边导航。

```tsx
<WrappedEoMenu mode="vertical">
  <WrappedEoMenuItem active>首页</WrappedEoMenuItem>
  <WrappedEoMenuItem>关于</WrappedEoMenuItem>
  <WrappedEoMenuItem disabled>设置</WrappedEoMenuItem>
</WrappedEoMenu>
```

### Horizontal Menu

水平菜单，用于顶部导航栏。

```tsx
<WrappedEoMenu mode="horizontal">
  <WrappedEoMenuItem active>首页</WrappedEoMenuItem>
  <WrappedEoMenuItem>产品</WrappedEoMenuItem>
  <WrappedEoMenuItem>文档</WrappedEoMenuItem>
</WrappedEoMenu>
```
