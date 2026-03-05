---
tagName: eo-avatar-group
displayName: WrappedEoAvatarGroup
description: 头像组构件，将多个头像排列展示，自动为子头像添加边框并统一控制尺寸
category: display-component
source: "@next-bricks/basic"
---

# WrappedEoAvatarGroup

> 头像组构件，将多个头像排列展示，自动为子头像添加边框并统一控制尺寸

## 导入

```tsx
import { WrappedEoAvatarGroup } from "@easyops/wrapped-components";
```

## Props

| 属性 | 类型                                     | 必填 | 默认值 | 说明                       |
| ---- | ---------------------------------------- | ---- | ------ | -------------------------- |
| size | `"large" \| "medium" \| "small" \| "xs"` | 否   | -      | 统一设置组内所有头像的尺寸 |

## Slots

| 名称     | 说明                                                          |
| -------- | ------------------------------------------------------------- |
| （默认） | 头像列表，放置 WrappedEoAvatar 或 WrappedEoEasyopsAvatar 构件 |

## Examples

### Basic

头像组将多个不同类型的头像排列展示，并自动为每个头像添加边框。

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
