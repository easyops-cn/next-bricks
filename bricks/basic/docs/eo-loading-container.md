---
tagName: eo-loading-container
displayName: WrappedEoLoadingContainer
description: 加载状态容器，在 loading 时显示遮罩和旋转图标，支持延迟显示以防止闪烁
category: display-component
source: "@next-bricks/basic"
---

# eo-loading-container

> 加载状态容器，在 loading 时显示遮罩和旋转图标，支持延迟显示以防止闪烁

## Props

| 属性    | 类型          | 必填 | 默认值     | 说明                               |
| ------- | ------------- | ---- | ---------- | ---------------------------------- |
| loading | `boolean`     | -    | -          | 是否显示加载状态                   |
| delay   | `number`      | -    | -          | 延迟显示加载效果的时间（防止闪烁） |
| size    | `LoadingSize` | -    | `"medium"` | 加载图标的尺寸                     |

## Slots

| 名称      | 说明 |
| --------- | ---- |
| (default) | 内容 |

## Examples

### 基础用法

将需要加载的内容放入容器，通过 `loading` 属性控制是否显示加载遮罩。

```yaml preview
brick: eo-loading-container
properties:
  loading: true
children:
  - brick: eo-button
    properties:
      textContent: Hello world
```

### 延迟显示

通过 `delay` 属性延迟显示加载效果，避免数据快速返回时的闪烁现象，单位为毫秒。

```yaml preview
brick: eo-loading-container
properties:
  loading: true
  delay: 500
children:
  - brick: eo-text
    properties:
      textContent: 内容区域
```

### 加载图标尺寸

通过 `size` 属性控制加载图标的大小，支持 "small"、"medium"、"large" 三种规格。

```yaml preview
- brick: eo-loading-container
  properties:
    loading: true
    size: small
  children:
    - brick: eo-text
      properties:
        textContent: Small
- brick: eo-loading-container
  properties:
    loading: true
    size: medium
  children:
    - brick: eo-text
      properties:
        textContent: Medium
- brick: eo-loading-container
  properties:
    loading: true
    size: large
  children:
    - brick: eo-text
      properties:
        textContent: Large
```
