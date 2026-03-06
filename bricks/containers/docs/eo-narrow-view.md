---
tagName: eo-narrow-view
displayName: WrappedEoNarrowView
description: 窄布局视图（居中）
category: container-layout
source: "@next-bricks/containers"
---

# eo-narrow-view

> 窄布局视图（居中）

## Props

| 属性 | 类型                                       | 必填 | 默认值     | 说明                                     |
| ---- | ------------------------------------------ | ---- | ---------- | ---------------------------------------- |
| size | `"small" \| "medium" \| "large" \| "full"` | 否   | `"medium"` | 窄布局尺寸，控制内容区最大宽度及居中显示 |

## Slots

| 名称     | 说明   |
| -------- | ------ |
| （默认） | 内容区 |

## Examples

### Basic

展示 eo-narrow-view 的基本用法，内容居中显示。

```html preview
<eo-narrow-view>Hello world</eo-narrow-view>
```

### Size

通过 `size` 属性控制内容区宽度，支持 `small`、`medium`、`large`、`full` 四个级别。

```yaml preview
- brick: eo-narrow-view
  properties:
    size: small
  children:
    - brick: div
      properties:
        textContent: Small narrow view
        style:
          background: var(--palette-blue-2)
          padding: 8px
- brick: eo-narrow-view
  properties:
    size: medium
  children:
    - brick: div
      properties:
        textContent: Medium narrow view (default)
        style:
          background: var(--palette-green-2)
          padding: 8px
- brick: eo-narrow-view
  properties:
    size: large
  children:
    - brick: div
      properties:
        textContent: Large narrow view
        style:
          background: var(--palette-orange-2)
          padding: 8px
- brick: eo-narrow-view
  properties:
    size: full
  children:
    - brick: div
      properties:
        textContent: Full size (no centering)
        style:
          background: var(--palette-red-2)
          padding: 8px
```
