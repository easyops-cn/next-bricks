---
tagName: eo-tooltip
displayName: WrappedEoTooltip
description: 提示
category: feedback-and-tooltip
source: "@next-bricks/basic"
---

# eo-tooltip

> 提示

## Props

| 属性      | 类型               | 必填 | 默认值    | 说明                                                                                                                                                        |
| --------- | ------------------ | ---- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon      | `GeneralIconProps` | -    | -         | 图标                                                                                                                                                        |
| content   | `string`           | -    | -         | 内容                                                                                                                                                        |
| placement | `Placement`        | -    | -         | 弹出位置，支持 `top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`left`、`left-start`、`left-end`、`right`、`right-start`、`right-end` |
| disabled  | `boolean`          | -    | `false`   | 是否禁用                                                                                                                                                    |
| open      | `boolean`          | -    | -         | 是否显示                                                                                                                                                    |
| trigger   | `string`           | -    | -         | 激活方式，包括 `click` \| `hover` \| `focus` \| `manual`，可以多选用空格分隔                                                                                |
| hoist     | `boolean`          | -    | -         | 是否使用固定定位防止内容被裁切                                                                                                                              |
| maxWidth  | `string`           | -    | `"250px"` | 最大长度                                                                                                                                                    |

## Events

| 事件              | detail                   | 说明                                     |
| ----------------- | ------------------------ | ---------------------------------------- |
| open.change       | `boolean` — 当前是否可见 | 当提示可见性开始变化时触发               |
| after.open.change | `boolean` — 当前是否可见 | 当提示可见性变化完成并完成所有动画后触发 |

## Methods

| 方法 | 参数 | 返回值 | 说明     |
| ---- | ---- | ------ | -------- |
| show | -    | `void` | 显示提示 |
| hide | -    | `void` | 隐藏提示 |

## Slots

| 名称      | 说明               |
| --------- | ------------------ |
| (default) | 提示的目标元素     |
| content   | 放置在提示中的元素 |

## Examples

### Basic

通过 `content` 设置提示文本，使用 `trigger` 指定触发方式，`open.change` 和 `after.open.change` 事件监听可见性变化。

```yaml preview
brick: div
properties:
  style:
    margin: 50px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    events:
      open.change:
        - action: console.log
          args:
            - open.change
            - <% EVENT.detail %>
      after.open.change:
        - action: console.log
          args:
            - after.open.change
            - <% EVENT.detail %>
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
```

### Icon

通过 `icon` 属性为提示配置一个图标作为触发目标。

```yaml preview
brick: div
properties:
  style:
    margin: 50px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      icon:
        lib: antd
        icon: search
      trigger: hover
    events:
      open.change:
        - action: console.log
          args:
            - open.change
            - <% EVENT.detail %>
      after.open.change:
        - action: console.log
          args:
            - after.open.change
            - <% EVENT.detail %>
```

### Trigger

`trigger` 属性支持 `hover`、`click`、`focus`、`manual` 四种触发方式。

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: click
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: click
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: focus
    children:
      - brick: eo-input
        properties:
          type: primary
          textContent: focus
```

### Placement

通过 `placement` 属性控制提示弹出的方向位置。

```yaml preview
brick: div
properties:
  style:
    margin: 150px
    display: grid
    grid-template-areas: |
      ". top-start top top-end ."
      "left-start . . . right-start"
      "left . . . right"
      "left-end . . . right-end"
      ". bottom-start bottom bottom-end ."
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr
    gap: 20px
children:
  - brick: :forEach
    dataSource:
      - top-start
      - top
      - top-end
      - right-start
      - right
      - right-end
      - bottom-start
      - bottom
      - bottom-end
      - left-start
      - left
      - left-end
    slots:
      "":
        bricks:
          - brick: eo-tooltip
            properties:
              content: This is a tooltip
              trigger: hover
              placement: <% ITEM %>
              style:
                grid-area: <% ITEM %>
            children:
              - brick: eo-button
                properties:
                  type: primary
                  textContent: <% ITEM %>
```

### Hoist

`hoist: true` 使用固定定位，避免提示内容被父元素的 `overflow: hidden` 裁切。

```yaml preview
brick: div
properties:
  style:
    position: relative
    display: flex
    margin: 50px
    padding: 20px
    border: 1px solid red
    overflow: hidden
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      hoist: false
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      hoist: true
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
```

### Slot

使用 `content` 插槽可以放置富文本内容作为提示内容，比纯文本的 `content` 属性更灵活。

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      trigger: hover
    slots:
      "content":
        bricks:
          - brick: strong
            properties:
              style:
                color: red
              textContent: This is a tooltip
      "":
        bricks:
          - brick: eo-button
            properties:
              type: primary
              textContent: hover
```

### Methods

调用 `show()` 方法以编程方式显示提示，调用 `hide()` 方法隐藏提示。

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 20px
children:
  - brick: eo-tooltip
    iid: myTooltip
    properties:
      content: This is a tooltip
      trigger: manual
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: Target
  - brick: eo-button
    properties:
      textContent: Show
    events:
      click:
        target: "#myTooltip"
        method: show
  - brick: eo-button
    properties:
      textContent: Hide
    events:
      click:
        target: "#myTooltip"
        method: hide
```
