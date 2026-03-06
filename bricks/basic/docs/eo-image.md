---
tagName: eo-image
displayName: WrappedEoImage
description: 通用图片构件
category: display-component
source: "@next-bricks/basic"
---

# eo-image

> 通用图片构件

## Props

| 属性        | 类型            | 必填 | 默认值 | 说明       |
| ----------- | --------------- | ---- | ------ | ---------- |
| imgList     | `ImageConfig[]` | -    | -      | 图片列表   |
| width       | `string`        | -    | -      | 图片宽度   |
| height      | `string`        | -    | -      | 图片高度   |
| onlyPreview | `boolean`       | -    | -      | 纯预览模式 |

## Events

| 事件          | detail                     | 说明                   |
| ------------- | -------------------------- | ---------------------- |
| visibleChange | `boolean` — 预览框是否可见 | 预览框显示或隐藏时触发 |

## Methods

| 方法  | 参数                                                                    | 返回值 | 说明       |
| ----- | ----------------------------------------------------------------------- | ------ | ---------- |
| open  | <ul><li>`index?: number` - 要预览的图片索引，不传则预览第一张</li></ul> | `void` | 打开预览框 |
| close | -                                                                       | `void` | 关闭预览框 |

## Examples

### 基础用法

展示一组图片列表，支持设置统一的宽高。

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
```

### 预览功能

开启预览后，点击图片可弹出预览框；设置 `preview: false` 可禁用单张图片的预览。

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        width: 100
        preview: false
```

### 加载失败兜底图

当图片加载失败时，自动显示 `fallback` 指定的备用图片。

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://www.error.com/test.png"
        fallback: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        width: 100
```

### 监听预览状态变化

通过 `visibleChange` 事件可以感知预览框的打开或关闭状态。

```yaml preview
- brick: eo-image
  properties:
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
  events:
    visibleChange:
      - action: console.log
        args:
          - "preview visible:"
          - "<% EVENT.detail %>"
```

### 纯预览模式与方法调用

使用 `onlyPreview` 纯预览模式，并通过 `open`/`close` 方法手动控制预览框的显示。

```yaml preview
- brick: eo-image
  ref: myImage
  properties:
    onlyPreview: true
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        width: 100
        preview: true
- brick: eo-button
  properties:
    textContent: 打开预览
  events:
    click:
      - target: "#myImage"
        method: open
        args:
          - 0
- brick: eo-button
  properties:
    textContent: 关闭预览
  events:
    click:
      - target: "#myImage"
        method: close
```

### 全局宽高

通过顶层 `width` 和 `height` 属性为所有图片设置统一尺寸，单张图片的 `width`/`height` 优先级更高。

```yaml preview
- brick: eo-image
  properties:
    width: "120px"
    height: "80px"
    imgList:
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      - src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
```
