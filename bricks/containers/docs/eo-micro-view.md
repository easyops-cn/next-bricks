---
tagName: eo-micro-view
displayName: WrappedEoMicroView
description: 基础页面布局
category: container-layout
source: "@next-bricks/containers"
deprecated: true
---

# eo-micro-view

> 基础页面布局
>
> **已废弃（Deprecated）**：请使用更新的页面布局构件。

## Props

| 属性      | 类型     | 必填 | 默认值 | 说明                       |
| --------- | -------- | ---- | ------ | -------------------------- |
| pageTitle | `string` | 否   | -      | 页面标题，显示在内容区顶部 |

## Slots

| 名称      | 说明                                   |
| --------- | -------------------------------------- |
| (default) | 主内容区                               |
| toolbar   | 工具栏插槽，有内容时自动显示工具栏区域 |

## Examples

### Basic

展示带有页面标题和内容区的基础页面布局。

```html preview
<eo-micro-view page-title="页面标题">Content</eo-micro-view>
```

### With Toolbar

在 `toolbar` 插槽中放置操作按钮，有内容时工具栏区域自动显示。

```yaml preview
- brick: eo-micro-view
  properties:
    pageTitle: 页面标题
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 主内容区
            style:
              padding: 16px
              border: 1px solid #eee
    toolbar:
      bricks:
        - brick: eo-button
          properties:
            type: primary
            textContent: 新建
        - brick: eo-button
          properties:
            textContent: 导出
```

### No Title

不设置 `pageTitle` 时，标题区域不渲染，只保留内容区。

```yaml preview
- brick: eo-micro-view
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 无标题页面内容
            style:
              padding: 16px
```
