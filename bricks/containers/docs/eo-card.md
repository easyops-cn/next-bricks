---
tagName: eo-card
displayName: WrappedEoCard
description: 通用卡片构件
category: card-info
source: "@next-bricks/containers"
---

# eo-card

> 通用卡片构件

## Props

| 属性             | 类型                   | 必填 | 默认值      | 说明                                                                                             |
| ---------------- | ---------------------- | ---- | ----------- | ------------------------------------------------------------------------------------------------ |
| cardTitle        | `string`               | -    | -           | 标题                                                                                             |
| headerIcon       | `GeneralIconProps`     | -    | -           | 头部图标                                                                                         |
| fillVertical     | `boolean`              | -    | -           | 自动撑满父容器。注意不可以同时使用 `fillVertical` 和 `verticalCenter`                            |
| verticalCenter   | `boolean`              | -    | -           | 垂直居中。注意不可以同时使用 `fillVertical` 和 `verticalCenter`                                  |
| hasExtraSlot     | `boolean`              | -    | -           | 是否右上角有操作区 slot                                                                          |
| operationButtons | `OperationButton[]`    | -    | `[]`        | 右上角的操作按钮列表                                                                             |
| headerStyle      | `React.CSSProperties`  | -    | -           | 头部样式                                                                                         |
| bodyStyle        | `React.CSSProperties`  | -    | -           | 内容区域样式                                                                                     |
| background       | `boolean \| string`    | -    | -           | 背景设置。传 `false` 可去除背景，传字符串可自定义背景色（如 CSS 颜色值），默认使用标准背景填充色 |
| outline          | `CardOutline`          | -    | `"default"` | 卡片轮廓。默认情况下，使用默认背景填充色，8.2 下默认则为无描边且无填充。                         |
| hideSplit        | `boolean`              | -    | -           | 是否隐藏分割线                                                                                   |
| themeVariant     | `"default" \| "elevo"` | -    | -           | 主题变体，可选 `"default"` 或 `"elevo"`                                                          |

## Slots

| 名称        | 说明             |
| ----------- | ---------------- |
| _(默认)_    | 卡片内容         |
| extra       | 头部右侧拓展元素 |
| titleSuffix | 标题后缀的插槽   |

## Examples

### Basic

展示带标题的基本卡片用法。

```yaml preview
brick: eo-card
properties:
  cardTitle: 卡片标题
children:
  - brick: div
    properties:
      textContent: Content
```

### Fill Vertical

展示卡片自动撑满父容器高度的效果。

```yaml preview
brick: div
properties:
  style:
    height: 300px
children:
  - brick: eo-card
    properties:
      cardTitle: Hello
      fillVertical: true
      style:
        height: 100%
    children:
      - brick: div
        properties:
          textContent: World
          style:
            background: var(--palette-green-2)
            height: 100%
```

### Vertical Center

展示卡片内容垂直居中的效果。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    verticalCenter: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
            style:
              height: 50px
```

### Hide Split

展示隐藏标题和内容之间分割线的效果。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    hideSplit: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
            style:
              display: flex
              background: pink
              height: 200px
              alignItems: center
              justifyContent: center
              fontSize: 22px
              fontWeight: 500
              color: "#fff"
```

### Extra Slot

展示在卡片头部右侧使用 extra 插槽放置额外操作元素。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    hasExtraSlot: true
  slots:
    extra:
      bricks:
        - brick: eo-button
          properties:
            textContent: Extra Button
```

### titleSuffix Slot

展示在卡片标题后缀插槽中放置提示图标。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
  slots:
    titleSuffix:
      bricks:
        - brick: eo-tooltip
          properties:
            content: This is a tooltip
            trigger: hover
          children:
            - brick: eo-icon
              properties:
                lib: antd
                category: filled
                icon: info-circle
                style:
                  height: 14px
                  lineHeight: 14px
                  fontSize: 14px
                  marginLeft: 6px
                  color: var(--color-normal-text)
```

### Header Icon

展示卡片标题前带有图标的效果。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    headerIcon:
      lib: antd
      icon: search
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Header Style

展示自定义卡片头部样式。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    headerStyle:
      background: "#abc"
      color: "#fff"
      fontSize: 22px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Background

展示卡片去除背景和自定义背景色的效果。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    background: false
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
- brick: div
  properties:
    style:
      height: 10px
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    background: "#abc"
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Outline

展示不同卡片轮廓样式（border、shadow、background、none）的效果。

```yaml preview gap
- brick: div
  properties:
    style:
      display: grid
      flexDirection: column
      gap: 1em
  children:
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        textContent: "outline: (not set)"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        outline: border
        hideSplit: true
        textContent: "outline: border"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        hideSplit: true
        outline: shadow
        textContent: "outline: shadow"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        outline: background
        background: var(--color-fill-bg-base-4)
        textContent: "outline: background"
```

### Operation Buttons

展示在卡片头部右上角配置操作按钮列表。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    operationButtons:
      - id: btn-edit
        eventName: edit
        text: 编辑
        configProps:
          type: text
      - id: btn-delete
        eventName: delete
        text: 删除
        configProps:
          type: text
          danger: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Body Style and Theme Variant

展示自定义内容区域样式以及使用 elevo 主题变体。

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    bodyStyle:
      padding: 24px
      background: var(--palette-blue-1)
    themeVariant: elevo
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content with custom body style and elevo theme
```
