---
tagName: eo-tab-group
displayName: WrappedEoTabGroup
description: Tab 容器组
category: container-layout
source: "@next-bricks/containers"
---

# eo-tab-group

> Tab 容器组

## Props

| 属性          | 类型                  | 必填 | 默认值      | 说明                                                                                        |
| ------------- | --------------------- | ---- | ----------- | ------------------------------------------------------------------------------------------- |
| type          | `TabType`             | -    | `"default"` | 样式类型                                                                                    |
| activePanel   | `string`              | -    | -           | 当前激活的面板名称，对应 tab-item 的 panel 属性                                             |
| contentStyle  | `React.CSSProperties` | -    | -           | 内容样式                                                                                    |
| outline       | `TabsOutline`         | -    | `"default"` | 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。该属性对 panel 类型无效（其始终无轮廓）。 |
| fillContainer | `boolean`             | -    | -           | 是否填满容器高度，启用后 tab 组件高度为 100%，内容区域自动撑满剩余空间                      |

## Events

| 事件       | detail                        | 说明            |
| ---------- | ----------------------------- | --------------- |
| tab.select | `string` — 当前选中的面板名称 | 选择 tab 时触发 |

## Slots

| 名称  | 说明                            |
| ----- | ------------------------------- |
| nav   | 导航区域，放置 eo-tab-item 组件 |
| extra | 导航栏右侧额外内容              |

## Examples

### 基本用法

展示默认样式的 Tab 容器组，包含多个 tab-item 切换面板。

```yaml preview
- brick: eo-tab-group
  properties:
    activePanel: "panel1"
  events:
    tab.select:
      action: console.log
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "panel1"
                    label: "选项卡一"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "选项卡二"
                - brick: eo-tab-item
                  properties:
                    panel: "panel3"
                    label: "选项卡三"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "面板一的内容"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "面板二的内容"
    panel3:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "面板三的内容"
```

### 胶囊样式

使用 capsule 类型展示胶囊风格的 Tab 容器。

```yaml preview
- brick: eo-tab-group
  properties:
    type: "capsule"
    activePanel: "panel1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "panel1"
                    label: "胶囊一"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "胶囊二"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "胶囊面板一的内容"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "胶囊面板二的内容"
```

### 面板样式

使用 panel 类型展示面板风格的 Tab，该类型始终无轮廓。

```yaml preview
- brick: eo-tab-group
  properties:
    type: "panel"
    activePanel: "panel1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "panel1"
                    label: "面板一"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "面板二"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "面板类型内容一"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "面板类型内容二"
```

### 文字样式

使用 text 类型展示纯文字风格的 Tab。

```yaml preview
- brick: eo-tab-group
  properties:
    type: "text"
    activePanel: "panel1"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "panel1"
                    label: "文字一"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "文字二"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "文字样式面板一"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "文字样式面板二"
```

### 阴影轮廓与自定义内容样式

使用 outline 属性设置阴影轮廓，并通过 contentStyle 自定义内容区域样式。

```yaml preview
- brick: eo-tab-group
  properties:
    outline: "shadow"
    activePanel: "panel1"
    contentStyle:
      padding: "24px"
      background: "#fafafa"
  slots:
    nav:
      type: bricks
      bricks:
        - brick: eo-tab-list
          slots:
            "":
              type: bricks
              bricks:
                - brick: eo-tab-item
                  properties:
                    panel: "panel1"
                    label: "选项卡一"
                - brick: eo-tab-item
                  properties:
                    panel: "panel2"
                    label: "选项卡二"
    extra:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "额外操作"
    panel1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "阴影轮廓面板一"
    panel2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: "阴影轮廓面板二"
```

### 填满容器

启用 fillContainer 使 Tab 组件填满父容器高度。

```yaml preview
- brick: div
  properties:
    style:
      height: "300px"
  slots:
    "":
      type: bricks
      bricks:
        - brick: eo-tab-group
          properties:
            fillContainer: true
            activePanel: "panel1"
          slots:
            nav:
              type: bricks
              bricks:
                - brick: eo-tab-list
                  slots:
                    "":
                      type: bricks
                      bricks:
                        - brick: eo-tab-item
                          properties:
                            panel: "panel1"
                            label: "选项卡一"
                        - brick: eo-tab-item
                          properties:
                            panel: "panel2"
                            label: "选项卡二"
            panel1:
              type: bricks
              bricks:
                - brick: div
                  properties:
                    textContent: "填满容器面板一"
            panel2:
              type: bricks
              bricks:
                - brick: div
                  properties:
                    textContent: "填满容器面板二"
```
