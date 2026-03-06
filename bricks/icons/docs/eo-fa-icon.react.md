---
tagName: eo-fa-icon
displayName: WrappedEoFaIcon
description: Font Awesome 图标构件
category: display-component
source: "@next-bricks/icons"
---

# WrappedEoFaIcon

> Font Awesome 图标构件

## 导入

```tsx
import { WrappedEoFaIcon } from "@easyops/wrapped-components";
```

## Props

| 属性              | 类型                | 必填 | 默认值  | 说明           |
| ----------------- | ------------------- | ---- | ------- | -------------- |
| prefix            | `string`            | 否   | `"fas"` | 图标前缀       |
| icon              | `string`            | 否   | -       | 图标名         |
| startColor        | `string`            | 否   | -       | 渐变色起始颜色 |
| endColor          | `string`            | 否   | -       | 渐变色终止颜色 |
| gradientDirection | `GradientDirection` | 否   | -       | 渐变色方向     |

## Events

| 事件              | detail                   | 说明               |
| ----------------- | ------------------------ | ------------------ |
| onIconFoundChange | `boolean` — 图标是否找到 | 图标查找完成时触发 |

## Examples

### Basic

展示常用 Font Awesome 图标，使用默认 `fas` 前缀。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: 32 }}>
  <WrappedEoFaIcon icon="heart" />
  <WrappedEoFaIcon icon="star" />
  <WrappedEoFaIcon icon="bell" />
</div>
```

### Prefix

使用不同前缀（`far` 规则图标、`fab` 品牌图标）展示同一图标的不同风格。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: 32 }}>
  <WrappedEoFaIcon prefix="fas" icon="heart" />
  <WrappedEoFaIcon prefix="far" icon="heart" />
  <WrappedEoFaIcon prefix="fab" icon="github" />
</div>
```

### Gradient Color

通过 `startColor`、`endColor` 和 `gradientDirection` 设置渐变色图标。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: 32 }}>
  <WrappedEoFaIcon icon="heart" startColor="pink" endColor="red" />
  <WrappedEoFaIcon icon="star" startColor="yellow" endColor="orange" />
  <WrappedEoFaIcon
    icon="bell"
    startColor="#4facfe"
    endColor="#00f2fe"
    gradientDirection="left-to-right"
  />
</div>
```

### Icon Found Event

监听 `onIconFoundChange` 事件，在图标加载成功或失败时作出响应。

```tsx
<WrappedEoFaIcon
  icon="heart"
  style={{ fontSize: 32 }}
  onIconFoundChange={(e) => console.log("icon found:", e.detail)}
/>
```
