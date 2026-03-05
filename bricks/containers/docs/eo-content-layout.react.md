---
tagName: eo-content-layout
displayName: WrappedEoContentLayout
description: 内容区流式布局（上下），为子元素之间提供默认的间距。
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoContentLayout

> 内容区流式布局（上下），为子元素之间提供默认的间距。

## 导入

```tsx
import { WrappedEoContentLayout } from "@easyops/wrapped-components";
```

## Slots

| 名称        | 说明   |
| ----------- | ------ |
| _(default)_ | 内容区 |

## Examples

### Basic

基本用法，将子元素以上下流式排列并自动添加间距。

```tsx
<WrappedEoContentLayout>
  <WrappedEoButton textContent="Hello" />
  <WrappedEoButton textContent="Goodbye" />
</WrappedEoContentLayout>
```
