---
tagName: eo-drawer
displayName: WrappedEoDrawer
description: 通用抽屉构件
category: container-display
source: "@next-bricks/containers"
---

# eo-drawer

> 通用抽屉构件

## Props

| 属性                | 类型                   | 必填 | 默认值    | 说明                                                                                      |
| ------------------- | ---------------------- | ---- | --------- | ----------------------------------------------------------------------------------------- |
| customTitle         | `string`               | -    | -         | 标题                                                                                      |
| subTitle            | `string`               | -    | -         | 副标题                                                                                    |
| width               | `number \| string`     | -    | `500`     | 宽度(placement为left，right时生效)                                                        |
| height              | `number \| string`     | -    | `378`     | 高度(placement为top，bottom时生效)                                                        |
| closable            | `boolean`              | -    | `true`    | 是否显示右上角的关闭按钮                                                                  |
| mask                | `boolean`              | -    | `true`    | 是否展示遮罩层                                                                            |
| maskClosable        | `boolean`              | -    | `true`    | 点击遮罩层是否关闭抽屉                                                                    |
| visible             | `boolean`              | -    | `false`   | 抽屉是否显示                                                                              |
| footerSlot          | `boolean`              | -    | `false`   | 是否存在底部插槽，启用后显示 footer 插槽区域                                              |
| placement           | `Placement`            | -    | `"right"` | 抽屉弹出方向，可选 "left" \| "right" \| "top" \| "bottom"                                 |
| scrollToTopWhenOpen | `boolean`              | -    | `true`    | 打开抽屉时内容区是否自动滚动到顶部（仅初始设置有效）                                      |
| maskStyle           | `object`               | -    | `{}`      | 自定义遮罩层的样式                                                                        |
| keyboard            | `boolean`              | -    | -         | 是否支持键盘 esc 关闭                                                                     |
| themeVariant        | `"default" \| "elevo"` | -    | -         | 主题变体，可选 "default" \| "elevo"，通过 CSS 属性选择器控制样式                          |
| stackable           | `boolean`              | -    | -         | 是否可堆叠，开启后每次打开抽屉会将新的抽屉置于上层（zIndex ++）（仅初始设置有效，已废弃） |

## Events

| 事件  | detail | 说明         |
| ----- | ------ | ------------ |
| open  | -      | 抽屉开启事件 |
| close | -      | 抽屉关闭事件 |

## Methods

| 方法  | 参数 | 返回值 | 说明         |
| ----- | ---- | ------ | ------------ |
| open  | -    | `void` | 抽屉开启方法 |
| close | -    | `void` | 抽屉关闭方法 |

## Slots

| 名称       | 说明                       |
| ---------- | -------------------------- |
| -          | 抽屉内容插槽               |
| headerLeft | 头部左上角（标题右侧）     |
| extra      | 头部右上角（关闭按钮左侧） |
| footer     | 抽屉底部插槽               |

## Examples

### Basic

通过按钮触发 open 方法打开抽屉，展示基本用法。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: 打开抽屉
  events:
    click:
      - target: "#drawer-basic"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    subTitle: 副标题
    id: "drawer-basic"
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Placement

通过 placement 属性设置抽屉从不同方向弹出。

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Top
  events:
    click:
      - target: "#drawer-top"
        method: open
- brick: eo-button
  properties:
    textContent: Left
  events:
    click:
      - target: "#drawer-left"
        method: open
- brick: eo-button
  properties:
    textContent: Right
  events:
    click:
      - target: "#drawer-right"
        method: open
- brick: eo-button
  properties:
    textContent: Bottom
  events:
    click:
      - target: "#drawer-bottom"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-top"
    placement: top
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-left"
    placement: left
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-right"
    placement: right
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-bottom"
    placement: bottom
```

### Width

通过 width 属性设置左右方向抽屉的宽度。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-width"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-width"
    width: 200
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Height

通过 height 属性设置上下方向抽屉的高度。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-height"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-height"
    height: 200
    placement: top
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Closable

通过 closable 属性控制是否显示右上角关闭按钮。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Show Close
  events:
    click:
      - target: "#drawer-show-close"
        method: open
- brick: eo-button
  properties:
    textContent: Hide Close
  events:
    click:
      - target: "#drawer-hide-close"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-show-close"
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-hide-close"
    closable: false
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Mask

通过 mask 属性控制是否展示遮罩层，maskClosable 控制点击遮罩层是否关闭抽屉。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Show Mask
  events:
    click:
      - target: "#drawer-show-mask"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-show-mask"
    mask: true
    maskClosable: true
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
- brick: eo-button
  properties:
    textContent: Hide Mask
  events:
    click:
      - target: "#drawer-hide-mask"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-hide-mask"
    mask: false
    maskClosable: false
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Slots

使用 footerSlot、headerLeft、extra 和 footer 插槽来自定义抽屉的头部和底部区域。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-slots"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-slots"
    footerSlot: true
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
    - brick: div
      slot: footer
      properties:
        textContent: 底部内容
    - brick: div
      slot: extra
      properties:
        textContent: 头部右上角
    - brick: div
      slot: headerLeft
      properties:
        textContent: 头部左上角
```

### Open Event & Close Event

监听抽屉的 open 和 close 事件，支持 keyboard（esc 键）关闭以及通过 close 方法关闭。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-events"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 抽屉标题
    id: "drawer-events"
    placement: left
    keyboard: true
  events:
    open:
      - action: message.success
        args:
          - Drawer Open
    close:
      - action: message.success
        args:
          - Drawer Close
  children:
    - brick: eo-button
      properties:
        textContent: 关闭弹窗
      events:
        click:
          - target: "#drawer-events"
            method: "close"
```

### Nested

抽屉支持嵌套，在一个抽屉中打开另一个抽屉。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open drawer
  events:
    click:
      - target: "#drawer-nested-1"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-nested-1"
    keyboard: true
  children:
    - brick: eo-button
      properties:
        textContent: Open nested drawer
      events:
        click:
          - target: "#drawer-nested-2"
            method: "open"
- brick: eo-drawer
  properties:
    customTitle: Nested Drawer Title
    id: "drawer-nested-2"
    keyboard: true
    width: 400
    textContent: This is a nested drawer.
```

### Custom Mask Style & Scroll To Top

自定义遮罩层样式，并设置 scrollToTopWhenOpen 控制打开时是否滚动到顶部。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-mask-style"
        method: open
- brick: eo-drawer
  properties:
    customTitle: 自定义遮罩样式
    id: "drawer-mask-style"
    scrollToTopWhenOpen: true
    maskStyle:
      backgroundColor: "rgba(0, 0, 0, 0.8)"
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```

### Theme Variant

通过 themeVariant 属性切换主题变体。

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-theme"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Elevo 主题
    id: "drawer-theme"
    themeVariant: elevo
  children:
    - brick: div
      properties:
        textContent: 抽屉内容
```
