---
tagName: eo-easyops-avatar
displayName: WrappedEoEasyopsAvatar
description: EasyOps 头像
category: display-component
source: "@next-bricks/basic"
---

# WrappedEoEasyopsAvatar

> EasyOps 头像

## 导入

```tsx
import { WrappedEoEasyopsAvatar } from "@easyops/wrapped-components";
```

## Props

| 属性             | 类型                         | 必填 | 默认值     | 说明                |
| ---------------- | ---------------------------- | ---- | ---------- | ------------------- |
| nameOrInstanceId | `string \| undefined`        | 否   | -          | 用户名或 instanceId |
| size             | `AvatarSize`                 | 是   | `"medium"` | 尺寸                |
| gapSize          | `AvatarGapSize \| undefined` | 否   | `"medium"` | 头像和名称间距大小  |
| bordered         | `boolean \| undefined`       | 否   | -          | 是否有边框          |
| showName         | `boolean \| undefined`       | 否   | -          | 是否展示用户名称    |

## CSS Parts

| 名称        | 说明                   |
| ----------- | ---------------------- |
| eo-avatar   | eo-avatar 元素         |
| avatar      | 头像容器               |
| avatar-img  | 显示为图片时的头像容器 |
| avatar-icon | 显示为图标时的头像容器 |
| avatar-text | 显示为文本时的头像容器 |
| name        | 用户名                 |

## Examples

### Basic

展示基础 EasyOps 头像，通过用户名或 instanceId 自动加载用户头像信息。

```tsx
<>
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops" />
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops1" />
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops_invalid" />
</>
```

### Show Name

展示头像同时显示用户名称。

```tsx
<>
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops" showName={true} />
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops1" showName={true} />
</>
```

### Size

展示不同尺寸的头像。

```tsx
<>
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops" size="small" />
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops" size="medium" />
  <WrappedEoEasyopsAvatar nameOrInstanceId="easyops" size="large" />
</>
```

### Bordered & Gap Size

展示有边框的头像，并自定义头像与名称的间距大小。

```tsx
<>
  <WrappedEoEasyopsAvatar
    nameOrInstanceId="easyops"
    bordered={true}
    showName={true}
    gapSize="small"
  />
  <WrappedEoEasyopsAvatar
    nameOrInstanceId="easyops"
    bordered={true}
    showName={true}
    gapSize="large"
  />
</>
```
