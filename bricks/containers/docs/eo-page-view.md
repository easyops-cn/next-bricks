---
tagName: eo-page-view
displayName: WrappedEoPageView
description: 页面视图布局构件，提供顶栏、侧边栏、子侧边栏、主内容区和底栏的多分区布局，支持窄布局居中模式和底栏 sticky/固定定位
category: container-layout
source: "@next-bricks/containers"
---

# eo-page-view

> 页面视图布局构件，提供顶栏、侧边栏、子侧边栏、主内容区和底栏的多分区布局，支持窄布局居中模式和底栏 sticky/固定定位

## Props

| 属性           | 类型                          | 必填 | 默认值 | 说明                                                                                                                                         |
| -------------- | ----------------------------- | ---- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| narrow         | `NarrowViewSize \| undefined` | 否   | -      | 设置窄布局模式（居中）。`"full"` 为全尺寸（非窄布局居中），`"small"` 为小尺寸窄布局，`"medium"` 为中等尺寸窄布局，`"large"` 为大尺寸窄布局。 |
| showFooter     | `boolean \| undefined`        | 否   | -      | 是否显示底栏（通常放置按钮）                                                                                                                 |
| fixedFooter    | `boolean \| undefined`        | 否   | -      | 底栏始终固定在底部。未设置时 footer 默认为 sticky，即：屏幕高度足够时，底栏跟随内容区上移而不是始终固定。                                    |
| reversedFooter | `boolean \| undefined`        | 否   | -      | 设置为 `true` 时，底栏子构件靠于右侧；默认不设置时靠于左侧。                                                                                 |

## Slots

| 名称       | 说明                 |
| ---------- | -------------------- |
| （默认）   | 内容区               |
| header     | 顶栏                 |
| sidebar    | 侧边栏               |
| subSidebar | 子侧边栏             |
| footer     | 底栏（通常放置按钮） |

## Examples

### Basic

展示页面视图的基本布局，包含顶栏、侧边栏、子侧边栏和内容区。

```yaml preview
brick: eo-page-view
properties:
  style:
    height: 300px
children:
  - brick: div
    slot: header
    properties:
      style:
        height: 50px
        background: green
      textContent: Header
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: purple
      textContent: Sidebar
  - brick: div
    slot: subSidebar
    properties:
      style:
        width: 208px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: div
    properties:
      style:
        width: 100%
        height: 100%
        background: blue
      textContent: Content
```

### With Main View

配合 eo-main-view 等构件组合成完整的页面布局。

```yaml preview
brick: eo-page-view
properties:
  style:
    height: 300px
children:
  - brick: div
    slot: header
    properties:
      style:
        height: 50px
        background: green
      textContent: Header
  - brick: div
    slot: sidebar
    properties:
      style:
        width: 220px
        height: 100%
        background: purple
      textContent: Sidebar
  - brick: div
    slot: subSidebar
    properties:
      style:
        width: 208px
        height: 100%
        background: red
      textContent: Sub-Sidebar
  - brick: eo-main-view
    children:
      - brick: eo-frame-breadcrumb
        slot: breadcrumb
        properties:
          breadcrumb:
            - text: Home
              to: /Home
            - text: Detail
              to: /Detail
            - text: List
              to: /List
      - brick: eo-page-title
        slot: pageTitle
        properties:
          pageTitle: Hello World
      - brick: div
        properties:
          textContent: Say hello to everyone! And then say goodbye to everyone!
```

### With Footer

通过 `showFooter` 显示底栏，通过 `fixedFooter` 控制是否固定在底部。

```yaml preview
brick: eo-page-view
properties:
  showFooter: true
  fixedFooter: true
  style:
    height: 300px
children:
  - brick: div
    properties:
      textContent: Page Content
      style:
        padding: 16px
  - brick: eo-button
    slot: footer
    properties:
      type: primary
      textContent: 保存
  - brick: eo-button
    slot: footer
    properties:
      textContent: 取消
```

### Narrow Layout

通过 `narrow` 属性设置内容区的窄布局居中模式。

```yaml preview
brick: eo-page-view
properties:
  narrow: medium
  style:
    height: 300px
children:
  - brick: div
    properties:
      textContent: Centered medium narrow content
      style:
        background: var(--palette-blue-2)
        padding: 16px
```

### Reversed Footer

通过 `reversedFooter` 使底栏子构件靠于右侧。

```yaml preview
brick: eo-page-view
properties:
  showFooter: true
  reversedFooter: true
  style:
    height: 300px
children:
  - brick: div
    properties:
      textContent: Page Content
      style:
        padding: 16px
  - brick: eo-button
    slot: footer
    properties:
      type: primary
      textContent: 保存
  - brick: eo-button
    slot: footer
    properties:
      textContent: 取消
```
