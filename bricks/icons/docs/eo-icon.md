---
tagName: eo-icon
displayName: WrappedEoIcon
description: 通用图标构件
category: display-component
source: "@next-bricks/icons"
---

# eo-icon

> 通用图标构件

## Props

| 属性                 | 类型                                      | 必填 | 默认值       | 说明                                                                                                    |
| -------------------- | ----------------------------------------- | ---- | ------------ | ------------------------------------------------------------------------------------------------------- |
| lib                  | `"antd" \| "easyops" \| "fa" \| "lucide"` | -    | -            | 图标库，支持 antd、easyops、fa（FontAwesome）、lucide 四种图标库                                        |
| theme                | `string`                                  | -    | `"outlined"` | Ant Design 图标主题                                                                                     |
| icon                 | `string`                                  | -    | -            | 图标名                                                                                                  |
| category             | `string`                                  | -    | `"default"`  | EasyOps 图标分类                                                                                        |
| prefix               | `string`                                  | ✅   | `"fas"`      | FontAwesome 图标前缀                                                                                    |
| strokeWidth          | `number`                                  | -    | `2`          | Lucide 图标描线粗线，限制在区间 `[0.5, 3]`                                                              |
| fill                 | `boolean`                                 | -    | -            | Lucide 图标是否填充（注意：仅部分图片有效）                                                             |
| fallback             | `GeneralIconProps`                        | -    | -            | 设置当图标未找到时的回退图标                                                                            |
| startColor           | `string`                                  | -    | -            | 渐变色起始颜色（不适用于 EasyOps 图标）                                                                 |
| endColor             | `string`                                  | -    | -            | 渐变色终止颜色（不适用于 EasyOps 图标）                                                                 |
| gradientDirection    | `GradientDirection`                       | -    | -            | 渐变色方向（不适用于 EasyOps 图标）                                                                     |
| spinning             | `boolean`                                 | -    | -            | 是否自动旋转                                                                                            |
| imgSrc               | `string`                                  | -    | -            | 图片地址                                                                                                |
| imgStyle             | `CSSProperties`                           | -    | -            | 图片样式                                                                                                |
| imgLoading           | `"lazy" \| "eager"`                       | -    | -            | 加载方式                                                                                                |
| noPublicRoot         | `boolean`                                 | -    | -            | 是否不自动拼接公共路径前缀（仅在使用 imgSrc 时生效）                                                    |
| keepSvgOriginalColor | `boolean`                                 | -    | -            | 如果是 svg 图片，默认将转换该图标颜色为自动跟随文本色，设置 `keepSvgOriginalColor: true` 可保留原始颜色 |

## Examples

### Basic

展示四种图标库的基本用法。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: antd
        icon: bell
    - brick: eo-icon
      properties:
        lib: fa
        icon: heart
    - brick: eo-icon
      properties:
        lib: easyops
        icon: honeycomb
    - brick: eo-icon
      properties:
        lib: lucide
        icon: activity
```

### Ant Design

展示 Ant Design 图标的不同主题（outlined、filled、twotone）。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: antd
        icon: bell
    - brick: eo-icon
      properties:
        lib: antd
        theme: filled
        icon: bell
    - brick: eo-icon
      properties:
        lib: antd
        theme: twotone
        icon: bell
```

### Font Awesome

展示 FontAwesome 图标的不同前缀（fas、far、fab）。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: fa
        icon: heart
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: heart
    - brick: eo-icon
      properties:
        lib: fa
        prefix: fab
        icon: github
```

### Lucide

展示 Lucide 图标库的基本用法。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: lucide
        icon: activity
    - brick: eo-icon
      properties:
        lib: lucide
        icon: languages
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
```

### EasyOps

展示 EasyOps 图标库的不同分类。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: easyops
        icon: honeycomb
    - brick: eo-icon
      properties:
        lib: easyops
        category: monitor
        icon: host
    - brick: eo-icon
      properties:
        lib: easyops
        category: model
        icon: app
```

### Image

使用 imgSrc 展示图片图标，包括 SVG 跟随文本色与保留原始颜色。

```yaml preview
brick: div
properties:
  style:
    display: flex
    gap: 1em
    fontSize: 32px
    color: var(--palette-green-6)
children:
  - brick: eo-icon
    properties:
      imgSrc: https://img.icons8.com/cotton/64/like--v1.png
  - brick: eo-icon
    properties:
      imgSrc: https://img.icons8.com/color/48/happy--v1.png
  - brick: eo-icon
    properties:
      imgSrc: https://img.icons8.com/flat-round/64/cottage.png
  - brick: eo-icon
    properties:
      imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
  - brick: eo-icon
    properties:
      imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
      keepSvgOriginalColor: true
```

### Colors

通过 CSS color 或渐变色属性（startColor、endColor、gradientDirection）自定义图标颜色。

```yaml preview
- brick: div
  properties:
    style:
      display: grid
      gridTemplateColumns: repeat(4, 1fr)
      justifyItems: center
      fontSize: 32px
      gap: 0.5em
  children:
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: branches
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: bell
    - brick: eo-icon
      properties:
        lib: easyops
        category: default
        icon: account
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: branches
        style:
          color: cyan
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: bell
        style:
          color: orange
    - brick: eo-icon
      properties:
        lib: easyops
        category: default
        icon: account
        style:
          color: gray
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
        style:
          color: red
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: branches
        startColor: yellow
        endColor: red
    - brick: eo-icon
      properties:
        lib: antd
        theme: outlined
        icon: function
        startColor: green
        endColor: blue
        gradientDirection: left-to-right
    - brick: eo-icon
      properties:
        lib: fa
        prefix: far
        icon: bell
        startColor: pink
        endColor: purple
    - brick: eo-icon
      properties:
        lib: lucide
        icon: ambulance
        gradientDirection: left-to-right
        startColor: pink
        endColor: red
```

### Spinning

展示图标自动旋转效果。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        spinning: true
        lib: antd
        theme: outlined
        icon: loading
    - brick: eo-icon
      properties:
        spinning: true
        lib: fa
        icon: spinner
    - brick: eo-icon
      properties:
        spinning: true
        lib: easyops
        category: third-menu
        icon: placeholder-third-menu
    - brick: eo-icon
      properties:
        spinning: true
        lib: lucide
        icon: loader-circle
```

### Fallback

当图标未找到时使用 fallback 指定回退图标。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: antd
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: fa
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: easyops
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: lucide
        icon: oops
        fallback:
          lib: fa
          icon: question
    - brick: eo-icon
      properties:
        lib: antd
        icon: oops
        fallback:
          imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
    - brick: eo-icon
      properties:
        imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/x-chart.svg"
        fallback:
          imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
    - brick: eo-icon
      properties:
        imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/x-chart.svg"
        fallback:
          imgSrc: "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/y-chart.svg"
```

### Lucide Stroke Width

Lucide 图标支持设置 strokeWidth，默认为 2，限制在 [0.5, 3] 区间。

```yaml preview
- brick: div
  properties:
    style:
      display: grid
      gridTemplateColumns: repeat(6, 1fr)
      width: fit-content
      gap: 0.25em 1em
      fontSize: 36px
  children:
    - brick: :forEach
      dataSource: [0.5, 1, 1.5, 2, 2.5, 3]
      children:
        - brick: eo-icon
          properties:
            lib: lucide
            icon: ambulance
            strokeWidth: <% ITEM %>
    - brick: :forEach
      dataSource: [0.5, 1, 1.5, 2, 2.5, 3]
      children:
        - brick: span
          properties:
            textContent: <% ITEM %>
            style:
              fontSize: 16px
              justifySelf: center
```

### Lucide Fill

Lucide 图标的 fill 填充模式。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      fontSize: 32px
  children:
    - brick: eo-icon
      properties:
        lib: lucide
        icon: heart
    - brick: eo-icon
      properties:
        lib: lucide
        icon: heart
        fill: true
```

### Image Style and Loading

通过 imgStyle 和 imgLoading 控制图片图标的样式和加载方式。

```yaml preview
- brick: div
  properties:
    style:
      display: flex
      gap: 1em
      alignItems: center
  children:
    - brick: eo-icon
      properties:
        imgSrc: https://img.icons8.com/cotton/64/like--v1.png
        imgStyle:
          width: 48px
          height: 48px
          borderRadius: 8px
        imgLoading: lazy
    - brick: eo-icon
      properties:
        imgSrc: https://img.icons8.com/color/48/happy--v1.png
        imgStyle:
          width: 32px
          height: 32px
        imgLoading: eager
        noPublicRoot: true
```
