---
tagName: eo-avatar-group
displayName: WrappedEoAvatarGroup
description: 头像组容器，将多个 eo-avatar 或 eo-easyops-avatar 以重叠堆叠的方式展示，并统一控制子头像的尺寸和边框
category: display-component
source: "@next-bricks/basic"
---

# WrappedEoAvatarGroup

> 头像组容器，将多个 eo-avatar 或 eo-easyops-avatar 以重叠堆叠的方式展示，并统一控制子头像的尺寸和边框

## 导入

```tsx
import { WrappedEoAvatarGroup } from "@easyops/wrapped-components";
```

## Props

| 属性 | 类型                                     | 必填 | 默认值 | 说明 |
| ---- | ---------------------------------------- | ---- | ------ | ---- |
| size | `"large" \| "medium" \| "small" \| "xs"` | 否   | -      | 尺寸 |

## Slots

| 名称     | 说明                                                  |
| -------- | ----------------------------------------------------- |
| （默认） | 放置 WrappedEoAvatar 或 WrappedEoEasyopsAvatar 子元素 |

## Examples

### Basic

头像组将多个不同类型的头像以重叠堆叠方式排列展示，并自动为每个头像添加边框。

```tsx
import {
  WrappedEoAvatar,
  WrappedEoAvatarGroup,
  WrappedEoEasyopsAvatar,
} from "@easyops/wrapped-components";

<WrappedEoAvatarGroup size="small">
  <WrappedEoAvatar
    src="https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right"
    name="Lucy"
  />
  <WrappedEoAvatar
    icon={{ lib: "antd", icon: "user", theme: "outlined", color: "#167be0" }}
    name="Lucy"
  />
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops" />
  <WrappedEoAvatar name="Lucy" />
</WrappedEoAvatarGroup>;
```

### Size

通过 size 属性统一设置组内所有头像的尺寸，支持 large、medium、small 和 xs 四种尺寸。

```tsx
import {
  WrappedEoAvatar,
  WrappedEoAvatarGroup,
} from "@easyops/wrapped-components";

<WrappedEoAvatarGroup size="large">
  <WrappedEoAvatar name="Alice" />
  <WrappedEoAvatar name="Bob" />
  <WrappedEoAvatar name="Carol" />
</WrappedEoAvatarGroup>;
```
