---
tagName: eo-page-title
displayName: WrappedEoPageTitle
description: 页面标题
category: text
source: "@next-bricks/basic"
---

# eo-page-title

> 页面标题

## Props

| 属性      | 类型     | 必填 | 默认值 | 说明                                                                                                  |
| --------- | -------- | ---- | ------ | ----------------------------------------------------------------------------------------------------- |
| pageTitle | `string` | -    | -      | 页面标题，设置后会同时更新浏览器页面标题。当页面处于 dashboard 模式时，标题以更大的字号（38px）显示。 |

## Examples

### Basic

基本用法，设置页面标题。

```yaml preview
- brick: eo-page-title
  properties:
    pageTitle: Hello world
```

### dashboard 模式显示

在 dashboard 模式下，标题以更大的字号显示。

```yaml preview
- brick: eo-page-title
  properties:
    pageTitle: Hello world
    dashboardMode: true
```
