---
tagName: eo-popover
displayName: WrappedEoPopover
description: 通用弹出层构件
category: container-display
source: "@next-bricks/basic"
---

# eo-popover

> 通用弹出层构件

## Props

| 属性          | 类型                                 | 必填 | 默认值       | 说明                             |
| ------------- | ------------------------------------ | ---- | ------------ | -------------------------------- |
| placement     | `Placement \| undefined`             | 否   | -            | 弹出层放置位置                   |
| trigger       | `TriggerEvent \| undefined`          | 否   | `"click"`    | 弹出触发方式                     |
| active        | `boolean \| undefined`               | 否   | `false`      | 弹出层是否已激活                 |
| arrow         | `boolean \| undefined`               | 否   | `true`       | 弹出层是否显示箭头               |
| shiftPadding  | `number \| undefined`                | 否   | -            | 发生移位行为之前超出的填充量     |
| arrowColor    | `string \| undefined`                | 否   | -            | 箭头颜色                         |
| strategy      | `"absolute" \| "fixed" \| undefined` | 否   | `"absolute"` | 弹出层如何定位                   |
| sync          | `Sync \| undefined`                  | 否   | -            | 将弹出层的宽高与 anchor 元素同步 |
| disabled      | `boolean \| undefined`               | 否   | -            | 是否禁用                         |
| distance      | `number \| undefined`                | 否   | -            | 弹出窗口与其锚点之间的距离       |
| anchorDisplay | `CSSProperties["display"]`           | 否   | -            | 触发器的显示类型                 |
| zIndex        | `number \| undefined`                | 否   | -            | 弹出层的 Z 轴顺序                |
| themeVariant  | `"default" \| "elevo" \| undefined`  | 否   | -            | 主题变体                         |

## Events

| 事件                  | detail                   | 说明                       |
| --------------------- | ------------------------ | -------------------------- |
| visible.change        | `boolean` — 当前是否可见 | 当弹出层可见性变化之后触发 |
| before.visible.change | `boolean` — 当前是否可见 | 当弹出层可见性变化时触发   |

## Slots

| 名称      | 说明             |
| --------- | ---------------- |
| (default) | 弹出层内容       |
| anchor    | 触发弹出层的元素 |

## CSS Parts

| 名称  | 说明                                                                           |
| ----- | ------------------------------------------------------------------------------ |
| popup | The popup's container. Useful for setting a background color, box shadow, etc. |

## Examples

### Triggers

展示 click 和 hover 两种触发方式。

```html preview
<div class="example">
  <eo-popover placement="bottom">
    <eo-button slot="anchor">Click me</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>

  <eo-popover trigger="hover" placement="bottom">
    <eo-button slot="anchor">Hover me</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 132px;
  }
  .example-panel {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Placements

展示弹出层在不同方位的放置效果。

```yaml preview
- brick: div
  properties:
    className: example
  children:
    - brick: eo-popover
      properties:
        placement: bottom-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Bottom Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: bottom
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Bottom
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: bottom-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Bottom-End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: right-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Right Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: right
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Right
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: right-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Right End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: left
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Left
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: left-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Left Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: left-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Left End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: top-start
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Top Start
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: top
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Top
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
    - brick: eo-popover
      properties:
        placement: top-end
      children:
        - brick: eo-button
          slot: anchor
          properties:
            textContent: Top End
        - brick: div
          properties:
            className: example-panel
            textContent: I'm popover
- brick: style
  properties:
    textContent: |
      .example {
         height: 200px;
         margin: 100px;
         position: relative;
         display: grid;
         grid-template-areas:
           ". ts t te ."
           "ls . . . rs"
           "l . . . r"
           "le . . . re"
           ". bs b be .";
       }
       .example-panel {
         width: 100px;
         height: 100px;
         display: flex;
         align-items: center;
         justify-content: center;
       }

       [placement="left-start"] {
         grid-area: ls;
         justify-self: end;
       }

       [placement="left-end"] {
         grid-area: le;
         justify-self: end;
       }

       [placement="left"] {
         grid-area: l;
         justify-self: end;
       }

       [placement="right-start"] {
         grid-area: rs;
       }
       [placement="right-end"] {
         grid-area: re;
       }
       [placement="right"] {
         grid-area: r;
       }

       [placement="top-start"] {
         grid-area: ts;
         justify-self: end;
         align-self: end;
       }
       [placement="top-end"] {
         grid-area: te;
         justify-self: start;
         align-self: end;
       }
       [placement="top"] {
         grid-area: t;
         justify-self: center;
         align-self: end;
       }

       [placement="bottom-start"] {
         grid-area: bs;
         justify-self: end;
       }
       [placement="bottom-end"] {
         grid-area: be;
         justify-self: start;
       }
       [placement="bottom"] {
         grid-area: b;
         justify-self: center;
       }
```

### Custom Style

通过 arrowColor 自定义箭头颜色，并使用 CSS Part 自定义弹出层容器样式。

```html preview
<div class="example">
  <eo-popover trigger="click" placement="bottom">
    <eo-button slot="anchor">Normal</eo-button>
    <div class="example-panel box1">I'm popover</div>
  </eo-popover>

  <eo-popover
    trigger="click"
    placement="bottom"
    arrow="true"
    arrow-color="pink"
  >
    <eo-button slot="anchor">Custom Style</eo-button>
    <div class="example-panel box2">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 132px;
  }
  .example-panel {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--medius-border-radius);
  }
  .box2 {
    background: pink;
  }
</style>
```

### Disabled

禁用状态下弹出层不会响应触发操作。

```html preview
<div class="example">
  <eo-popover placement="bottom" disabled>
    <eo-button slot="anchor">Click me</eo-button>
    <div class="example-panel">I'm popover</div>
  </eo-popover>
</div>

<style>
  .example {
    height: 132px;
  }
  .example-panel {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Events

监听弹出层可见性变化事件。

```yaml preview minHeight="160px"
brick: eo-popover
properties:
  placement: bottom
  strategy: fixed
  zIndex: 100
children:
  - brick: eo-button
    slot: anchor
    properties:
      textContent: Click me
  - brick: div
    properties:
      style:
        padding: 12px
      textContent: I'm popover content
events:
  visible.change:
    - action: console.log
      args:
        - visible changed
        - <% EVENT.detail %>
  before.visible.change:
    - action: console.log
      args:
        - before visible changed
        - <% EVENT.detail %>
```
