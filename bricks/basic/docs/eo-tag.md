---
tagName: eo-tag
displayName: WrappedEoTag
description: 标签构件
category: display-component
source: "@next-bricks/basic"
---

# eo-tag

> 标签构件

## Props

| 属性          | 类型                                     | 必填 | 默认值     | 说明                 |
| ------------- | ---------------------------------------- | ---- | ---------- | -------------------- |
| size          | `"large" \| "medium" \| "small" \| "xs"` | 否   | `"medium"` | 按钮大小             |
| icon          | `GeneralIconProps`                       | 否   | -          | 图标                 |
| color         | `TagColor \| string`                     | 否   | -          | 颜色                 |
| outline       | `boolean`                                | 否   | -          | 是否有边线           |
| disabled      | `boolean`                                | 否   | -          | 是否禁用             |
| closable      | `boolean`                                | 否   | -          | 是否允许关闭         |
| ellipsisWidth | `string`                                 | 否   | -          | 超过宽度文本隐藏宽度 |
| checkable     | `boolean`                                | 否   | -          | 是否允许选择         |
| checked       | `boolean`                                | 否   | -          | 是否选择             |
| tagStyle      | `React.CSSProperties`                    | 否   | -          | 标签自定义样式       |

## Events

| 事件  | detail                                                                                                                                                                                                                   | 说明     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| check | `TagProps` — { size: 标签大小, icon: 图标, color: 颜色, outline: 是否有边线, closable: 是否可关闭, disabled: 是否禁用, checkable: 是否可选择, checked: 当前选中状态, ellipsisWidth: 超出隐藏宽度, tagStyle: 自定义样式 } | 选择事件 |
| close | `TagProps` — { size: 标签大小, icon: 图标, color: 颜色, outline: 是否有边线, closable: 是否可关闭, disabled: 是否禁用, checkable: 是否可选择, checked: 当前选中状态, ellipsisWidth: 超出隐藏宽度, tagStyle: 自定义样式 } | 关闭事件 |

## Examples

### Basic

展示默认标签的基本用法。

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Normal Item
```

### Closable & Event

设置 `closable` 为 `true` 使标签可关闭，关闭时触发 `close` 事件。

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Normal Item
- brick: eo-tag
  properties:
    closable: true
    textContent: Closable Item
  events:
    close:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Checkable & Event

设置 `checkable` 为 `true` 使标签可选择，选择时触发 `check` 事件。

```yaml preview gap
- brick: eo-tag
  properties:
    checkable: true
    textContent: Check Item
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: eo-tag
  properties:
    checkable: true
    textContent: Default Checked Item
    checked: true
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Disabled

设置 `disabled` 为 `true` 禁用标签，禁用后关闭和选择功能均不可用。

```yaml preview gap
- brick: eo-tag
  properties:
    closable: true
    checkable: true
    disabled: true
    textContent: Disabled Item
```

### Size

通过 `size` 属性控制标签大小，支持 `large`、`medium`、`small`、`xs` 四种尺寸。

```yaml preview gap
- brick: eo-tag
  properties:
    size: large
    textContent: Large Item
- brick: eo-tag
  properties:
    size: medium
    textContent: Medium Item
- brick: eo-tag
  properties:
    size: small
    textContent: Small Item
```

### Color

通过 `color` 属性设置标签颜色，支持预设颜色和自定义颜色值。

```yaml preview gap
- brick: div
  properties:
    textContent: "Normal:"
- brick: eo-tag
  properties:
    color: gray
    textContent: 灰色
- brick: eo-tag
  properties:
    color: red
    textContent: 红色
- brick: eo-tag
  properties:
    color: orange
    textContent: 橙色
- brick: eo-tag
  properties:
    color: yellow
    textContent: 黄色
- brick: eo-tag
  properties:
    color: blue
    textContent: 蓝色
- brick: eo-tag
  properties:
    color: geekblue
    textContent: 深蓝色
- brick: eo-tag
  properties:
    color: grayblue
    textContent: 灰蓝色
- brick: eo-tag
  properties:
    color: cyan
    textContent: 浅蓝色
- brick: eo-tag
  properties:
    color: green
    textContent: 绿色
- brick: eo-tag
  properties:
    color: purple
    textContent: 紫色
- brick: eo-tag
  properties:
    color: teal
    textContent: 青绿色
- brick: eo-tag
  properties:
    color: pink
    textContent: 粉色
- brick: div
  properties:
    style:
      flexBasis: 100%
- brick: div
  properties:
    textContent: "Outline:"
- brick: eo-tag
  properties:
    color: gray
    outline: true
    textContent: 灰色
- brick: eo-tag
  properties:
    color: red
    outline: true
    textContent: 红色
- brick: eo-tag
  properties:
    color: orange
    outline: true
    textContent: 橙色
- brick: eo-tag
  properties:
    color: yellow
    outline: true
    textContent: 黄色
- brick: eo-tag
  properties:
    color: blue
    outline: true
    textContent: 蓝色
- brick: eo-tag
  properties:
    color: geekblue
    outline: true
    textContent: 深蓝色
- brick: eo-tag
  properties:
    color: grayblue
    outline: true
    textContent: 灰蓝色
- brick: eo-tag
  properties:
    color: cyan
    outline: true
    textContent: 浅蓝色
- brick: eo-tag
  properties:
    color: green
    outline: true
    textContent: 绿色
- brick: eo-tag
  properties:
    color: purple
    outline: true
    textContent: 紫色
- brick: eo-tag
  properties:
    color: teal
    outline: true
    textContent: 青绿色
- brick: eo-tag
  properties:
    color: pink
    outline: true
    textContent: 粉色
- brick: div
  properties:
    style:
      flexBasis: 100%
- brick: div
  properties:
    textContent: "Inverse:"
- brick: eo-tag
  properties:
    color: gray-inverse
    textContent: 灰色
- brick: eo-tag
  properties:
    color: red-inverse
    textContent: 红色
- brick: eo-tag
  properties:
    color: orange-inverse
    textContent: 橙色
- brick: eo-tag
  properties:
    color: yellow-inverse
    textContent: 黄色
- brick: eo-tag
  properties:
    color: blue-inverse
    textContent: 蓝色
- brick: eo-tag
  properties:
    color: geekblue-inverse
    textContent: 深蓝色
- brick: eo-tag
  properties:
    color: grayblue-inverse
    textContent: 灰蓝色
- brick: eo-tag
  properties:
    color: cyan-inverse
    textContent: 浅蓝色
- brick: eo-tag
  properties:
    color: green-inverse
    textContent: 绿色
- brick: eo-tag
  properties:
    color: purple-inverse
    textContent: 紫色
- brick: eo-tag
  properties:
    color: teal-inverse
    textContent: 青绿色
- brick: eo-tag
  properties:
    color: pink-inverse
    textContent: 粉色
```

### Icon

通过 `icon` 属性为标签添加图标。

```yaml preview gap
- brick: eo-tag
  properties:
    icon:
      lib: antd
      icon: star
    textContent: Star Tag
```

### TagStyle

通过 `tagStyle` 属性自定义标签样式。

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: TagStyle
    tagStyle:
      color: "#abc"
      width: 200px
```

### EllipsisWidth

通过 `ellipsisWidth` 属性设置文本超出宽度时的省略截断宽度。

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 100px
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 150px
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 300px
```
