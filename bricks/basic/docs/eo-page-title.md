---
tagName: eo-page-title
description: 页面标题构件，设置后同时更新浏览器标签页标题，在 dashboard 模式下以更大字号（38px）显示
category: text
source: "@next-bricks/basic"
---

# eo-page-title

> 页面标题构件，设置后同时更新浏览器标签页标题，在 dashboard 模式下以更大字号（38px）显示

## Props

| 属性      | 类型                  | 必填 | 默认值 | 说明                                                                                                  |
| --------- | --------------------- | ---- | ------ | ----------------------------------------------------------------------------------------------------- |
| pageTitle | `string \| undefined` | -    | -      | 页面标题，设置后会同时更新浏览器页面标题。当页面处于 dashboard 模式时，标题以更大的字号（38px）显示。 |

## Examples

### Basic

基本用法，设置页面标题。

```yaml preview
- brick: eo-page-title
  properties:
    pageTitle: Hello world
```
