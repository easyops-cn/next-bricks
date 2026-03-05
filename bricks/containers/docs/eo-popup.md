---
tagName: eo-popup
displayName: WrappedEoPopup
description: 可拖拽浮层弹窗容器。
category: container-display
source: "@next-bricks/containers"
---

# eo-popup

> 可拖拽浮层弹窗容器。

## Props

| 属性          | 类型                                                                   | 必填 | 默认值     | 说明                                                            |
| ------------- | ---------------------------------------------------------------------- | ---- | ---------- | --------------------------------------------------------------- |
| popupId       | `string`                                                               | 否   | -          | 浮层 ID，设置后开启位置记录功能，下次打开时恢复上次的位置和尺寸 |
| popupWidth    | `string \| number`                                                     | 否   | `500`      | 弹窗宽度                                                        |
| popupHeight   | `string \| number`                                                     | 否   | -          | 弹窗高度                                                        |
| popupTitle    | `string`                                                               | 否   | -          | 弹窗标题                                                        |
| openDirection | `"leftTop" \| "leftBottom" \| "rightTop" \| "rightBottom" \| "center"` | 否   | `"center"` | 弹窗打开位置                                                    |
| visible       | `boolean`                                                              | 否   | -          | 是否显示模态框                                                  |
| headerStyle   | `React.CSSProperties`                                                  | 否   | -          | 用于设置 popup 头部的样式                                       |
| wrapperStyle  | `React.CSSProperties`                                                  | 否   | -          | 用于设置 popup 容器的样式                                       |
| noPadding     | `boolean`                                                              | 否   | -          | 内容没有边距                                                    |
| resizable     | `boolean`                                                              | 否   | -          | 是否可调整尺寸                                                  |

## Methods

| 方法  | 参数 | 返回值 | 说明     |
| ----- | ---- | ------ | -------- |
| open  | -    | `void` | 显示弹窗 |
| close | -    | `void` | 关闭弹窗 |

## Slots

| 名称     | 说明           |
| -------- | -------------- |
| （默认） | 内容区         |
| toolbar  | 头部工具栏插槽 |

## Examples

### Basic

展示浮层弹窗的基本用法。

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: Popup
  popupHeight: 300px
  visible: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### Method & PopupId

通过 `open` / `close` 方法控制弹窗显示，`popupId` 开启位置记录功能。

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Open Popup
  events:
    click:
      - target: "#popup"
        method: open
- brick: eo-button
  properties:
    textContent: Close Popup
  events:
    click:
      - target: "#popup"
        method: close
- brick: eo-popup
  properties:
    popupTitle: Button Open
    popupHeight: 400px
    id: popup
    popupId: popupA
  children:
    - brick: div
      properties:
        textContent: Hello, I'm content!
```

### Resizable

通过 `resizable` 属性允许用户调整弹窗尺寸。

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: resizable
  visible: true
  resizable: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### Toolbar Slot

使用 `toolbar` 插槽在头部右侧放置工具按钮。

```yaml preview minHeight="300px"
brick: eo-popup
properties:
  popupTitle: resizable
  popupHeight: 200px
  visible: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
  - brick: eo-icon
    slot: toolbar
    properties:
      icon: edit
      lib: antd
      style:
        cursor: pointer
    events:
      click:
        - action: message.success
          args:
            - edit
```

### Open Direction

通过 `openDirection` 控制弹窗初始出现的位置。

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Left Top
  events:
    click:
      - target: "#popup-lt"
        method: open
- brick: eo-button
  properties:
    textContent: Right Bottom
  events:
    click:
      - target: "#popup-rb"
        method: open
- brick: eo-popup
  properties:
    id: popup-lt
    popupTitle: Left Top
    popupHeight: 200px
    openDirection: leftTop
  children:
    - brick: div
      properties:
        textContent: Opened from left top
- brick: eo-popup
  properties:
    id: popup-rb
    popupTitle: Right Bottom
    popupHeight: 200px
    openDirection: rightBottom
  children:
    - brick: div
      properties:
        textContent: Opened from right bottom
```

### No Padding

通过 `noPadding` 去除内容区边距，适用于全尺寸内容场景。

```yaml preview minHeight="400px"
brick: eo-popup
properties:
  popupTitle: No Padding
  popupHeight: 300px
  visible: true
  noPadding: true
children:
  - brick: div
    properties:
      textContent: Full-width content without padding
      style:
        background: var(--palette-blue-2)
        padding: 16px
        height: 100%
```
