---
tagName: illustrations.loading-transition
displayName: WrappedIllustrationsLoadingTransition
description: 加载过渡动画构件
category: display-component
source: "@next-bricks/illustrations"
---

# illustrations.loading-transition

> 加载过渡动画构件

## Examples

### Basic

展示加载过渡动画，通常用于页面切换或数据加载时的过渡效果。

```yaml preview minHeight="300px"
brick: div
properties:
  style:
    display: flex
    justifyContent: center
    alignItems: center
    width: 100%
    height: calc(100vh - 4em)
children:
  - brick: illustrations.loading-transition
```
