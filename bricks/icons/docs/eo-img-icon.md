---
tagName: eo-img-icon
displayName: WrappedEoImgIcon
description: 图片图标构件
category: display-component
source: "@next-bricks/icons"
---

# eo-img-icon

> 图片图标构件

## Props

| 属性         | 类型                | 必填 | 默认值 | 说明                             |
| ------------ | ------------------- | ---- | ------ | -------------------------------- |
| imgSrc       | `string`            | 否   | -      | 图片地址                         |
| imgStyle     | `CSSProperties`     | 否   | -      | 图片样式                         |
| imgLoading   | `"lazy" \| "eager"` | 否   | -      | 加载方式                         |
| noPublicRoot | `boolean`           | 否   | -      | 图片路径是否不添加公共根路径前缀 |

## Examples

### Basic

使用 `imgSrc` 展示图片图标。

```yaml preview
- brick: eo-img-icon
  properties:
    imgSrc: https://img.icons8.com/cotton/64/like--v1.png
    style:
      fontSize: 20px
```

### Image Style

通过 `imgStyle` 自定义图片样式，例如设置宽高或圆角。

```yaml preview
- brick: eo-img-icon
  properties:
    imgSrc: https://img.icons8.com/color/48/happy--v1.png
    imgStyle:
      width: 48px
      height: 48px
      borderRadius: 50%
```

### Lazy Loading

通过 `imgLoading` 控制图片的懒加载行为，提升页面性能。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
  children:
    - brick: eo-img-icon
      properties:
        imgSrc: https://img.icons8.com/cotton/64/like--v1.png
        imgLoading: lazy
    - brick: eo-img-icon
      properties:
        imgSrc: https://img.icons8.com/flat-round/64/cottage.png
        imgLoading: eager
```

### No Public Root

通过 `noPublicRoot` 使用不附加公共根路径前缀的图片地址。

```yaml preview
- brick: eo-img-icon
  properties:
    imgSrc: /static/icons/my-icon.png
    noPublicRoot: true
```
