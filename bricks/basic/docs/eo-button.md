---
tagName: eo-button
displayName: WrappedEoButton
description: 通用按钮构件
category: interact-basic
source: "@next-bricks/basic"
---

# eo-button

> 通用按钮构件

## Props

| 属性         | 类型                   | 必填 | 默认值      | 说明                                                                                                                                                           |
| ------------ | ---------------------- | ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         | `ButtonType`           | 否   | `"default"` | 按钮类型，可选值：`"primary"` \| `"default"` \| `"dashed"` \| `"ghost"` \| `"link"` \| `"text"` \| `"icon"` \| `"ai"` \| `"ai-alt"` \| `"neutral"` \| `"flat"` |
| size         | `ComponentSize`        | 否   | `"medium"`  | 按钮大小，可选值：`"large"` \| `"medium"` \| `"small"` \| `"xs"`                                                                                               |
| icon         | `GeneralIconProps`     | 否   | -           | 图标                                                                                                                                                           |
| shape        | `Shape`                | 否   | -           | 按钮形状，支持圆形、椭圆形，不设置为默认方形，可选值：`"round"` \| `"circle"`                                                                                  |
| danger       | `boolean`              | 否   | `false`     | 是否开启危险状态                                                                                                                                               |
| disabled     | `boolean`              | 否   | `false`     | 是否禁用                                                                                                                                                       |
| url          | `string`               | 否   | -           | 链接地址                                                                                                                                                       |
| href         | `string`               | 否   | -           | 跳转外链地址                                                                                                                                                   |
| target       | `string`               | 否   | -           | 链接类型                                                                                                                                                       |
| tooltip      | `string`               | 否   | -           | 鼠标悬停时显示的提示文字                                                                                                                                       |
| buttonStyle  | `React.CSSProperties`  | 否   | -           | 按钮样式                                                                                                                                                       |
| themeVariant | `"default" \| "elevo"` | 否   | -           | 主题变体                                                                                                                                                       |

## Events

此构件无自定义事件，原生 DOM 事件（如 `click`）可正常使用。

## Slots

| 名称     | 说明     |
| -------- | -------- |
| （默认） | 按钮内容 |

## CSS Parts

| 名称   | 说明     |
| ------ | -------- |
| button | 按钮元素 |

## Examples

### Types

展示按钮的所有类型，包括 primary、default、dashed、ghost、icon、text、link、ai 和 ai-alt。

```yaml preview gap
- brick: eo-button
  properties:
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    textContent: Default
- brick: eo-button
  properties:
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    type: icon
    icon:
      lib: antd
      icon: edit
- brick: eo-button
  properties:
    type: text
    textContent: Text
- brick: eo-button
  properties:
    type: link
    textContent: Link
- brick: eo-button
  properties:
    type: ai
    textContent: ai
- brick: eo-button
  properties:
    type: ai-alt
    size: large
    icon:
      lib: lucide
      icon: sparkles
      fill: true
      strokeWidth: 1.5
    textContent: ai-alt
```

### Sizes

展示按钮支持的四种尺寸：large、medium（默认）、small 和 xs。

```yaml preview gap
- brick: eo-button
  properties:
    size: large
    textContent: Large
- brick: eo-button
  properties:
    textContent: Medium
- brick: eo-button
  properties:
    size: small
    textContent: Small
- brick: eo-button
  properties:
    size: xs
    textContent: X-small
```

### Shapes

展示按钮的方形（默认）和圆形两种形状。

```yaml preview gap
- brick: eo-button
  properties:
    textContent: Square
- brick: eo-button
  properties:
    shape: circle
    textContent: X
```

### Danger

展示危险状态下各类型按钮的样式。

```yaml preview gap
- brick: eo-button
  properties:
    danger: true
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    danger: true
    textContent: Default
- brick: eo-button
  properties:
    danger: true
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    danger: true
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    danger: true
    type: text
    textContent: Text
- brick: eo-button
  properties:
    danger: true
    type: link
    textContent: Link
```

### Disabled

展示禁用状态下各类型按钮，禁用后按钮不可点击且鼠标显示禁止光标。

```yaml preview gap
- brick: eo-button
  properties:
    disabled: true
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    disabled: true
    textContent: Default
- brick: eo-button
  properties:
    disabled: true
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    disabled: true
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    disabled: true
    type: text
    textContent: Text
- brick: eo-button
  properties:
    disabled: true
    type: link
    textContent: Link
- brick: eo-button
  properties:
    disabled: true
    danger: true
    textContent: Danger
- brick: eo-button
  properties:
    disabled: true
    danger: true
    type: primary
    textContent: Danger primary
```

### Tooltip

使用 tooltip 属性为按钮添加悬停提示，禁用按钮的 tooltip 同样有效。

```yaml preview gap minHeight="130px"
- brick: eo-button
  properties:
    type: primary
    tooltip: primary
    textContent: Primary
- brick: eo-button
  properties:
    type: link
    tooltip: link
    textContent: Link
- brick: eo-button
  properties:
    disabled: true
    tooltip: disabled
    textContent: Default
```

### Icons

通过 icon 属性为按钮添加图标，可与文字组合使用或单独作为图标按钮。

```yaml preview gap
- brick: eo-flex-layout
  properties:
    gap: 8px
  children:
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: bell
        textContent: Alarm
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
        type: primary
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
        shape: circle
```

### Click

点击按钮时触发原生 click 事件，可绑定事件处理。

```yaml preview
- brick: eo-button
  properties:
    textContent: Click me
  events:
    click:
      action: message.success
      args:
        - Well done!
```

### Links

通过 href 或 url 属性使按钮具备链接跳转功能，target 控制打开方式。

```yaml preview
- brick: eo-button
  properties:
    type: link
    href: https://baidu.com/
    target: _blank
    textContent: Link to Baidu
```

### Custom Style

使用 buttonStyle 属性自定义按钮的内联样式。

```yaml preview
- brick: eo-button
  properties:
    type: primary
    textContent: Custom Style
    buttonStyle:
      borderRadius: 20px
      padding: 0 24px
```

### Theme Variant

通过 `themeVariant` 切换按钮的主题变体，`elevo` 变体适用于 Elevo 主题场景。

```yaml preview gap
- brick: eo-button
  properties:
    type: primary
    textContent: Default Theme
- brick: eo-button
  properties:
    type: primary
    themeVariant: elevo
    textContent: Elevo Theme
```
