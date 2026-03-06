---
tagName: eo-viewport
displayName: WrappedEoViewport
description: 设置 `<meta name="viewport" />` 以适配移动端。
category: layout
source: "@next-bricks/basic"
---

# WrappedEoViewport

> 设置 `<meta name="viewport" />` 以适配移动端。

## 导入

```tsx
import { WrappedEoViewport } from "@easyops/wrapped-components";
```

## Props

| 属性         | 类型     | 必填 | 默认值           | 说明             |
| ------------ | -------- | ---- | ---------------- | ---------------- |
| width        | `string` | -    | `"device-width"` | 视口宽度         |
| initialScale | `number` | -    | `1`              | 初始缩放比例     |
| minimumScale | `number` | -    | `0.1`            | 最小缩放比例     |
| maximumScale | `number` | -    | `10`             | 最大缩放比例     |
| userScalable | `string` | -    | `"1"`            | 是否允许用户缩放 |

## Examples

### Basic

在页面中放置 `WrappedEoViewport` 构件，会自动向 `<head>` 中注入 viewport meta 标签，适配移动端显示。

```tsx
<>
  <WrappedEoViewport />
  <h1>Hello World</h1>
</>
```

### CustomScale

自定义缩放限制，例如禁止用户缩放（`userScalable="no"`）或设置特定的初始缩放比例。

```tsx
<>
  <WrappedEoViewport
    initialScale={1}
    minimumScale={1}
    maximumScale={1}
    userScalable="no"
  />
  <h1>Fixed Scale Page</h1>
</>
```

### CustomWidth

通过 `width` 属性自定义视口宽度，适用于需要固定宽度布局的场景。

```tsx
<>
  <WrappedEoViewport width="375" initialScale={1} />
  <h1>Fixed Width Page</h1>
</>
```
