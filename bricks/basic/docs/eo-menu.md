---
tagName: eo-menu
displayName: WrappedEoMenu
description: 菜单构件，支持垂直和水平两种布局方式
category: navigation
source: "@next-bricks/basic"
---

# eo-menu

> 菜单构件，支持垂直和水平两种布局方式

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

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-item
      properties:
        textContent: 首页
        active: true
    - brick: eo-menu-item
      properties:
        textContent: 关于
    - brick: eo-menu-item
      properties:
        textContent: 设置
        disabled: true
```

### Horizontal Menu

水平菜单，用于顶部导航栏。

```yaml preview
- brick: eo-menu
  properties:
    mode: horizontal
  children:
    - brick: eo-menu-item
      properties:
        textContent: 首页
        active: true
    - brick: eo-menu-item
      properties:
        textContent: 产品
    - brick: eo-menu-item
      properties:
        textContent: 文档
```
