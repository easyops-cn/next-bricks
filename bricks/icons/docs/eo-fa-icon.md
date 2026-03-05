---
tagName: eo-fa-icon
displayName: WrappedEoFaIcon
description: Font Awesome 图标构件
category: display-component
source: "@next-bricks/icons"
---

# eo-fa-icon

> Font Awesome 图标构件

## Props

| 属性              | 类型                | 必填 | 默认值  | 说明           |
| ----------------- | ------------------- | ---- | ------- | -------------- |
| prefix            | `string`            | 否   | `"fas"` | 图标前缀       |
| icon              | `string`            | 否   | -       | 图标名         |
| startColor        | `string`            | 否   | -       | 渐变色起始颜色 |
| endColor          | `string`            | 否   | -       | 渐变色终止颜色 |
| gradientDirection | `GradientDirection` | 否   | -       | 渐变色方向     |

## Events

| 事件       | detail                   | 说明               |
| ---------- | ------------------------ | ------------------ |
| icon.found | `boolean` — 图标是否找到 | 图标查找完成时触发 |

## Examples

### Basic

展示常用 Font Awesome 图标，使用默认 `fas` 前缀。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-fa-icon
      properties:
        icon: heart
    - brick: eo-fa-icon
      properties:
        icon: star
    - brick: eo-fa-icon
      properties:
        icon: bell
```

### Prefix

使用不同前缀（`far` 规则图标、`fab` 品牌图标）展示同一图标的不同风格。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-fa-icon
      properties:
        prefix: fas
        icon: heart
    - brick: eo-fa-icon
      properties:
        prefix: far
        icon: heart
    - brick: eo-fa-icon
      properties:
        prefix: fab
        icon: github
```

### Gradient Color

通过 `startColor`、`endColor` 和 `gradientDirection` 设置渐变色图标。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-fa-icon
      properties:
        icon: heart
        startColor: pink
        endColor: red
    - brick: eo-fa-icon
      properties:
        icon: star
        startColor: yellow
        endColor: orange
    - brick: eo-fa-icon
      properties:
        icon: bell
        startColor: "#4facfe"
        endColor: "#00f2fe"
        gradientDirection: left-to-right
```

### Icon Found Event

监听 `icon.found` 事件，在图标加载成功或失败时作出响应。

```yaml preview
- brick: eo-fa-icon
  properties:
    icon: heart
    style:
      fontSize: 32px
  events:
    icon.found:
      action: console.log
      args:
        - "icon found: <% EVENT.detail %>"
```
