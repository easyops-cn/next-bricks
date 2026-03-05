---
tagName: eo-modal
displayName: WrappedEoModal
description: 模态框
category: container-display
source: "@next-bricks/containers"
---

# eo-modal

> 模态框

## Props

| 属性             | 类型                   | 必填 | 默认值    | 说明                                                                                          |
| ---------------- | ---------------------- | ---- | --------- | --------------------------------------------------------------------------------------------- |
| modalTitle       | `string`               | 否   | -         | 标题                                                                                          |
| width            | `string \| number`     | 否   | `"520px"` | 宽度                                                                                          |
| height           | `string \| number`     | 否   | -         | 高度                                                                                          |
| minWidth         | `string \| number`     | 否   | `"520px"` | 最小宽度                                                                                      |
| minHeight        | `string \| number`     | 否   | -         | 最小高度                                                                                      |
| centered         | `boolean`              | 否   | -         | 是否垂直居中显示。当设置 `themeVariant` 为 `elevo` 时，默认为 `true`。                        |
| maskClosable     | `boolean`              | 否   | -         | 点击遮罩层是否关闭模态框                                                                      |
| fullscreen       | `boolean`              | 否   | -         | 全屏模式                                                                                      |
| fullscreenButton | `boolean`              | 否   | -         | 是否显示全屏按钮                                                                              |
| noFooter         | `boolean`              | 否   | -         | 是否隐藏底部                                                                                  |
| headerBordered   | `boolean`              | 否   | -         | 是否显示头部底边线（themeVariant: elevo 时默认不显示头部底边线）                              |
| background       | `string`               | 否   | -         | 背景                                                                                          |
| closeWhenConfirm | `boolean`              | 否   | `true`    | 点击确定按钮时自动关闭弹窗                                                                    |
| confirmDisabled  | `boolean`              | 否   | -         | 确认按钮是否禁用                                                                              |
| visible          | `boolean`              | 否   | -         | 是否显示模态框                                                                                |
| confirmText      | `string`               | 否   | -         | 确认按钮文本                                                                                  |
| cancelText       | `string`               | 否   | -         | 取消按钮文本                                                                                  |
| confirmDanger    | `boolean`              | 否   | -         | 确认按钮类型（危险样式）                                                                      |
| hideCancelButton | `boolean`              | 否   | -         | 是否隐藏取消按钮                                                                              |
| keyboard         | `boolean`              | 否   | -         | 是否支持键盘 esc 关闭                                                                         |
| themeVariant     | `"default" \| "elevo"` | 否   | -         | 主题变体                                                                                      |
| stackable        | `boolean`              | 否   | -         | 是否可堆叠，开启后每次打开会将新的弹窗置于上层（zIndex ++）。注意：仅初始设置有效。（已废弃） |

## Events

| 事件    | detail | 说明               |
| ------- | ------ | ------------------ |
| open    | `void` | 打开弹窗时触发     |
| close   | `void` | 关闭弹窗时触发     |
| confirm | `void` | 点击确认按钮时触发 |
| cancel  | `void` | 点击取消按钮时触发 |

## Methods

| 方法  | 参数 | 返回值 | 说明       |
| ----- | ---- | ------ | ---------- |
| open  | -    | `void` | 打开模态框 |
| close | -    | `void` | 关闭模态框 |

## Slots

| 名称     | 说明         |
| -------- | ------------ |
| （默认） | 内容插槽     |
| footer   | 底部左侧插槽 |
| sidebar  | 弹窗左侧插槽 |

## Examples

### Basic

通过 `open` 方法打开模态框，展示基本用法。

```html preview minHeight="320px"
<eo-modal modal-title="Modal Title" visible="true">Content</eo-modal>
```

### Width & Height

通过 `width` 和 `height` 属性控制模态框尺寸。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Modal
  events:
    click:
      - target: "#modal"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal"
    modalTitle: 模态框标题
    width: 300px
    height: 200px
  children:
    - brick: div
      properties:
        textContent: Content
```

### MaskClosable

通过 `maskClosable` 控制点击遮罩层是否关闭模态框。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Mask Allow Close
  events:
    click:
      - target: "#modal-mask-allow-close"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: 模态框标题
    id: "modal-mask-allow-close"
    maskClosable: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 模态框内容
- brick: eo-button
  properties:
    textContent: Mask Not Allow Close
  events:
    click:
      - target: "#modal-mast-not-allow-close"
        method: open
- brick: eo-modal
  properties:
    modalTitle: 模态框标题
    id: "modal-mast-not-allow-close"
    maskClosable: false
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 模态框内容
```

### Fullscreen

通过 `fullscreen` 属性开启全屏模式。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: 模态框标题
    id: "modal"
    fullscreen: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: 模态框内容
```

### Confirm Text & Cancel Text

通过 `confirmText` 和 `cancelText` 自定义底部按钮文本。

```html preview minHeight="320px"
<eo-modal
  modal-title="Modal Title"
  visible="true"
  confirm-text="提交"
  cancel-text="放弃"
>
  Content
</eo-modal>
```

### Hide Cancel Button

通过 `hideCancelButton` 隐藏取消按钮，适用于只需确认的场景。

```html preview minHeight="320px"
<eo-modal modal-title="Modal Title" visible="true" hide-cancel-button="true">
  Content
</eo-modal>
```

### Open Event & Close Event

监听 `open` 和 `close` 事件，结合 `keyboard` 属性支持 Esc 键关闭。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: 模态框标题
    id: "modal"
    keyboard: true
  events:
    open:
      - action: message.success
        args:
          - modal Open
    close:
      - action: message.success
        args:
          - modal Close
  children:
    - brick: div
      properties:
        textContent: Content
```

### Sidebar Slot

使用 `sidebar` 插槽在模态框左侧放置内容（如导航菜单）。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: 模态框标题
    id: "modal"
    keyboard: true
    width: 700px
  events:
    open:
      - action: message.success
        args:
          - modal Open
    close:
      - action: message.success
        args:
          - modal Close
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
      type: bricks
    sidebar:
      bricks:
        - brick: div
          properties:
            textContent: Sidebar
      type: bricks
```

### Confirm Danger & Disabled

通过 `confirmDanger` 设置危险样式确认按钮，`confirmDisabled` 禁用确认按钮。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Danger Modal
  events:
    click:
      - target: "#modal-danger"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-danger"
    modalTitle: 删除确认
    confirmDanger: true
    confirmText: 删除
  children:
    - brick: div
      properties:
        textContent: 确认删除此项？
```

### No Footer

通过 `noFooter` 隐藏底部区域，适用于纯展示场景。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open
  events:
    click:
      - target: "#modal-no-footer"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-no-footer"
    modalTitle: 无底部模态框
    noFooter: true
  children:
    - brick: div
      properties:
        textContent: 仅展示内容，无底部按钮。
```
