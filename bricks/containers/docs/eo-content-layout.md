---
tagName: eo-content-layout
displayName: WrappedEoContentLayout
description: 内容区流式布局（上下），为子元素之间提供默认的间距。
category: container-layout
source: "@next-bricks/containers"
---

# eo-content-layout

> 内容区流式布局（上下），为子元素之间提供默认的间距。

## Slots

| 名称        | 说明   |
| ----------- | ------ |
| _(default)_ | 内容区 |

## Examples

### Basic

基本用法，将子元素以上下流式排列并自动添加间距。

```yaml preview
brick: eo-content-layout
children:
  - brick: eo-button
    properties:
      textContent: Hello
  - brick: eo-button
    properties:
      textContent: Goodbye
```
