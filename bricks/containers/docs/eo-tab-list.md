---
tagName: eo-tab-list
displayName: WrappedEoTabList
description: Tab 列表
category: container-display
source: "@next-bricks/containers"
---

# eo-tab-list

> Tab 列表

## Props

| 属性          | 类型                                      | 必填 | 默认值      | 说明                                                                                        |
| ------------- | ----------------------------------------- | ---- | ----------- | ------------------------------------------------------------------------------------------- |
| type          | `TabType \| undefined`                    | -    | `"default"` | 样式类型                                                                                    |
| tabs          | `(TabItemProps \| string)[] \| undefined` | -    | -           | 标签页列表                                                                                  |
| activePanel   | `string \| undefined`                     | -    | -           | 激活状态 tab 的 panel                                                                       |
| contentStyle  | `React.CSSProperties \| undefined`        | -    | -           | 内容样式                                                                                    |
| outline       | `TabsOutline \| undefined`                | -    | `"default"` | 轮廓。默认情况下，使用阴影，8.2 下默认则为无轮廓。该属性对 panel 类型无效（其始终无轮廓）。 |
| autoPlay      | `boolean \| undefined`                    | -    | `false`     | 是否开启标签内容自动轮播                                                                    |
| autoSpeed     | `number`                                  | -    | `3000`      | 轮播的时间间隔，单位 ms                                                                     |
| fillContainer | `boolean \| undefined`                    | -    | -           | 是否撑满容器                                                                                |

## Events

| 事件       | detail           | 说明            |
| ---------- | ---------------- | --------------- |
| tab.select | `string` — panel | 选择 tab 时触发 |

## Slots

| 名称    | 说明       |
| ------- | ---------- |
| extra   | 头部插槽   |
| [panel] | Tab 页插槽 |

## Examples

### Tabs

基本标签页列表用法，支持字符串简写和对象格式定义标签项。

```yaml preview
- brick: eo-tab-list
  events:
    tab.select:
      - action: console.log
  properties:
    tabs:
      - text: Create
        panel: Create
      - text: Edit
        panel: Edit
      - text: "Delete"
        panel: "Delete"
      - text: "Query"
        panel: "Query"
      - Setting
  slots:
    Create:
      bricks:
        - brick: div
          properties:
            textContent: Panel Create
    Edit:
      bricks:
        - brick: div
          properties:
            textContent: Panel Edit
    Delete:
      bricks:
        - brick: div
          properties:
            textContent: Panel Delete
    Query:
      bricks:
        - brick: div
          properties:
            textContent: Panel Query
    Setting:
      bricks:
        - brick: div
          properties:
            textContent: Panel Setting
```

### Type & Disabled

展示不同样式类型（default、panel、capsule、text）以及禁用标签项的效果。

```yaml preview
- brick: eo-flex-layout
  properties:
    gap: 10px
    flexDirection: column
  children:
    - brick: style
      properties:
        textContent: |
          .title {
            font-size: 16px;
            color: var(--normal-color-text);
          }
    - brick: div
      properties:
        textContent: "Default Type"
        className: title
    - brick: eo-tab-list
      properties:
        tabs:
          - text: Tab 1
            panel: tab-1
          - text: Tab 2
            panel: tab-2
          - text: Tab 3
            panel: tab-3
            disabled: true
      children:
        - brick: div
          slot: tab-1
          properties:
            textContent: Tab 1 Content
        - brick: div
          slot: tab-2
          properties:
            textContent: Tab 2 Content
        - brick: div
          slot: tab-3
          properties:
            textContent: Tab 3 Content
    - brick: div
      properties:
        textContent: "Panel Type"
        className: title
    - brick: eo-tab-list
      properties:
        type: panel
        tabs:
          - text: Tab 1
            panel: tab-1
          - text: Tab 2
            panel: tab-2
          - text: Tab 3
            panel: tab-3
            disabled: true
      children:
        - brick: div
          slot: tab-1
          properties:
            textContent: Tab 1 Content
        - brick: div
          slot: tab-2
          properties:
            textContent: Tab 2 Content
        - brick: div
          slot: tab-3
          properties:
            textContent: Tab 3 Content
    - brick: div
      properties:
        textContent: "Capsule Type"
        className: title
    - brick: eo-tab-list
      properties:
        type: capsule
        tabs:
          - text: Tab 1
            panel: tab-1
          - text: Tab 2
            panel: tab-2
          - text: Tab 3
            panel: tab-3
            disabled: true
      children:
        - brick: div
          slot: tab-1
          properties:
            textContent: Tab 1 Content
        - brick: div
          slot: tab-2
          properties:
            textContent: Tab 2 Content
        - brick: div
          slot: tab-3
          properties:
            textContent: Tab 3 Content
    - brick: div
      properties:
        textContent: "Text Type"
        className: title
    - brick: eo-tab-list
      properties:
        type: text
        tabs:
          - text: Tab 1
            panel: tab-1
          - text: Tab 2
            panel: tab-2
          - text: Tab 3
            panel: tab-3
            disabled: true
      children:
        - brick: div
          slot: tab-1
          properties:
            textContent: Tab 1 Content
        - brick: div
          slot: tab-2
          properties:
            textContent: Tab 2 Content
        - brick: div
          slot: tab-3
          properties:
            textContent: Tab 3 Content
```

### With Badge

展示标签项带数字徽标的效果，支持自定义徽标颜色。

```yaml preview
- brick: eo-flex-layout
  properties:
    gap: 10px
    flexDirection: column
  children:
    - brick: style
      properties:
        textContent: |
          .title {
            font-size: 16px;
            color: var(--normal-color-text);
          }
    - brick: div
      properties:
        textContent: "Default Badge"
        className: title
    - brick: eo-tab-list
      properties:
        tabs:
          - text: Tab 1
            panel: tab-1
            badgeConf:
              count: 1
          - text: Tab 2
            panel: tab-2
            badgeConf:
              count: 10
          - text: Tab 3
            panel: tab-3
            badgeConf:
              count: 100
      children:
        - brick: div
          slot: tab-1
          properties:
            textContent: Tab 1 Content
        - brick: div
          slot: tab-2
          properties:
            textContent: Tab 2 Content
        - brick: div
          slot: tab-3
          properties:
            textContent: Tab 3 Content
    - brick: div
      properties:
        textContent: "Custom Badge"
        className: title
    - brick: eo-tab-list
      properties:
        type: panel
        tabs:
          - text: Tab 1
            panel: tab-1
            badgeConf:
              count: 1
              color: var(--palette-yellow-4)
              fontColor: var(--normal-text-color)
          - text: Tab 2
            panel: tab-2
            badgeConf:
              count: 20
              color: var(--palette-red-4)
              fontColor: "#fff"
          - text: Tab 3
            panel: tab-3
            badgeConf:
              count: 100
      children:
        - brick: div
          slot: tab-1
          properties:
            textContent: Tab 1 Content
        - brick: div
          slot: tab-2
          properties:
            textContent: Tab 2 Content
        - brick: div
          slot: tab-3
          properties:
            textContent: Tab 3 Content
```

### ActivePanel & Extra

通过 activePanel 设置默认激活的标签页，并使用 extra 插槽在标签头部添加额外内容。

```yaml preview
- brick: eo-tab-list
  properties:
    activePanel: Edit
    tabs:
      - text: Create
        panel: Create
        icon:
          lib: antd
          icon: file
      - text: Edit
        panel: Edit
        icon:
          lib: "antd"
          icon: "edit"
      - text: "Delete"
        panel: "Delete"
        icon:
          lib: "antd"
          icon: "delete"
        disabled: true
      - text: "Query"
        panel: "Query"
        hidden: true
      - text: "Setting"
        panel: "Setting"
        icon:
          lib: "antd"
          icon: "setting"
  slots:
    Create:
      bricks:
        - brick: div
          properties:
            textContent: Panel Create
    Edit:
      bricks:
        - brick: div
          properties:
            textContent: Panel Edit
    Delete:
      bricks:
        - brick: div
          properties:
            textContent: Panel Delete
    Query:
      bricks:
        - brick: div
          properties:
            textContent: Panel Query
    Setting:
      bricks:
        - brick: div
          properties:
            textContent: Panel Setting
    extra:
      bricks:
        - brick: eo-button
          properties:
            textContent: Extra Button
```

### No Outline

设置 outline 为 none 去除标签内容区域的轮廓。

```yaml preview
- brick: eo-tab-list
  properties:
    tabs:
      - Item A
      - Item B
      - Item C
    outline: none
  slots:
    "Item A":
      bricks:
        - brick: div
          properties:
            textContent: Item A
    "Item B":
      bricks:
        - brick: div
          properties:
            textContent: Item B
    "Item C":
      bricks:
        - brick: div
          properties:
            textContent: Item C
```

### Panel Color

展示标签项自定义面板颜色的效果。

```yaml preview
- brick: eo-tab-list
  properties:
    tabs:
      - text: Item A
        panel: Item A
      - text: Item B
        panel: Item B
        panelColor: var(--palette-green-6)
      - text: Item C
        panel: Item C
        panelColor: var(--palette-red-6)
    outline: none
  slots:
    "Item A":
      bricks:
        - brick: div
          properties:
            textContent: Item A
    "Item B":
      bricks:
        - brick: div
          properties:
            textContent: Item B
    "Item C":
      bricks:
        - brick: div
          properties:
            textContent: Item C
```

### Content Style

通过 contentStyle 自定义标签内容区域的样式，例如设置固定高度和滚动。

```yaml preview
- brick: eo-tab-list
  events:
    tab.select:
      - action: console.log
  properties:
    tabs:
      - text: Tab1
        panel: Tab1
      - text: Tab2
        panel: Tab2
      - text: Tab3
        panel: Tab3
    contentStyle:
      height: 300px
      overflow: scroll
  slots:
    Tab1:
      bricks:
        - brick: div
          properties:
            className: box red
            textContent: Red
        - brick: div
          properties:
            className: box green
            textContent: Green
        - brick: div
          properties:
            className: box blue
            textContent: Blue
    Tab2:
      bricks:
        - brick: div
          properties:
            textContent: Tab 2
    Tab3:
      bricks:
        - brick: div
          properties:
            textContent: Tab 3
- brick: style
  properties:
    textContent: |
      .box {
        height: 150px;
        text-align: center;
        line-height: 150px;
        color: #fff;
        font-size: 40px;
      }
      .red {
        background: var(--palette-red-6);
      }
      .green {
        background: var(--palette-green-6);
      }
      .blue {
        background: var(--palette-blue-6);
      }
```

### Auto Play

开启 autoPlay 自动轮播标签内容，可通过 autoSpeed 调整轮播间隔。

```yaml preview
- brick: eo-tab-list
  events:
    tab.select:
      - action: console.log
  properties:
    autoPlay: true
    autoSpeed: 2000
    tabs:
      - text: Create
        panel: Create
      - text: Edit
        panel: Edit
      - text: "Delete"
        panel: "Delete"
      - text: "Query"
        panel: "Query"
  slots:
    Create:
      bricks:
        - brick: div
          properties:
            textContent: Panel Create
    Edit:
      bricks:
        - brick: div
          properties:
            textContent: Panel Edit
    Delete:
      bricks:
        - brick: div
          properties:
            textContent: Panel Delete
    Query:
      bricks:
        - brick: div
          properties:
            textContent: Panel Query
```

### Fill Container

设置 fillContainer 使标签组件撑满父容器高度。

```yaml preview minHeight="300px"
brick: div
properties:
  style:
    height: calc(100vh - 4em)
children:
  - brick: eo-tab-list
    properties:
      tabs:
        - text: Create
          panel: create
        - text: Edit
          panel: edit
      fillContainer: true
    slots:
      create:
        bricks:
          - brick: div
            properties:
              textContent: Panel Create
              style:
                height: 100%
                border: 1px solid gray
      edit:
        bricks:
          - brick: div
            properties:
              textContent: Panel Edit
              style:
                height: 100%
                border: 1px solid gray
```
