---
tagName: eo-avatar
displayName: WrappedEoAvatar
description: 头像构件，支持图片、图标、文字三种展示方式，可配置尺寸、形状和边框
category: display-component
source: "@next-bricks/basic"
---

# eo-avatar

> 头像构件，支持图片、图标、文字三种展示方式，可配置尺寸、形状和边框

## Props

| 属性     | 类型                                     | 必填 | 默认值     | 说明                     |
| -------- | ---------------------------------------- | ---- | ---------- | ------------------------ |
| size     | `"large" \| "medium" \| "small" \| "xs"` | 否   | `"medium"` | 尺寸                     |
| gapSize  | `"medium" \| "large"`                    | 否   | `"medium"` | 头像和名称间距大小       |
| shape    | `"circle" \| "round-square"`             | 否   | `"circle"` | 形状                     |
| src      | `string`                                 | 否   | -          | 图片地址                 |
| alt      | `string`                                 | 否   | -          | 图像无法显示时的替代文本 |
| icon     | `GeneralIconProps`                       | 否   | -          | 图标                     |
| name     | `string`                                 | 否   | -          | 用户名                   |
| bordered | `boolean`                                | 否   | -          | 是否有边框               |
| showName | `boolean`                                | 否   | -          | 是否展示名称             |

## CSS Parts

| 名称        | 说明                   |
| ----------- | ---------------------- |
| avatar      | 头像容器               |
| avatar-img  | 显示为图片时的头像容器 |
| avatar-icon | 显示为图标时的头像容器 |
| avatar-text | 显示为文本时的头像容器 |
| name        | 用户名                 |

## Examples

### Type

展示图片、图标、文字三种头像类型。

```yaml preview gap
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
- brick: eo-avatar
  properties:
    icon:
      lib: antd
      icon: user
      theme: outlined
      color: "#167be0"
    name: Lucy
- brick: eo-avatar
  properties:
    name: Lucy
```

### Size

展示 large、medium、small、xs 四种尺寸。

```yaml preview gap
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: large
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: medium
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: small
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: xs
```

### Shape

展示圆形和圆角方形两种头像形状。

```yaml preview
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    shape: circle
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    shape: round-square
```

### 边框与名称展示

开启边框和名称显示，以及设置名称间距。

```yaml preview gap
- brick: eo-avatar
  properties:
    name: Lucy
    bordered: true
    showName: true
- brick: eo-avatar
  properties:
    name: Lucy
    bordered: true
    showName: true
    gapSize: large
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    alt: Lucy avatar
    showName: true
```
