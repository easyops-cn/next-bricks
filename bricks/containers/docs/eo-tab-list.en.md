---
tagName: eo-tab-list
displayName: WrappedEoTabList
description: Tab list
category: container-display
source: "@next-bricks/containers"
---

# eo-tab-list

> Tab list

## Props

| property      | type                                      | required | default     | description                                                                                                                                                |
| ------------- | ----------------------------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | `TabType \| undefined`                    | -        | `"default"` | Style type                                                                                                                                                 |
| tabs          | `(TabItemProps \| string)[] \| undefined` | -        | -           | List of tabs                                                                                                                                               |
| activePanel   | `string \| undefined`                     | -        | -           | Panel of the active tab                                                                                                                                    |
| contentStyle  | `React.CSSProperties \| undefined`        | -        | -           | Content style                                                                                                                                              |
| outline       | `TabsOutline \| undefined`                | -        | `"default"` | Outline. By default a shadow is used; under 8.2 the default is no outline. This property has no effect on the panel type (which never has an outline).      |
| autoPlay      | `boolean \| undefined`                    | -        | `false`     | Whether to enable automatic carousel of the tab contents                                                                                                   |
| autoSpeed     | `number`                                  | -        | `3000`      | Carousel interval in ms                                                                                                                                    |
| fillContainer | `boolean \| undefined`                    | -        | -           | Whether to fill the container                                                                                                                              |

## Events

| event      | detail           | description                     |
| ---------- | ---------------- | ------------------------------- |
| tab.select | `string` — panel | Triggered when a tab is selected |

## Slots

| name    | description  |
| ------- | ------------ |
| extra   | Header slot  |
| [panel] | Tab page slot |

## Examples

### Tabs

Basic tab list usage; tab items can be defined with the shorthand string form or the object form.

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

Demonstrates the different style types (default, panel, capsule, text) and a disabled tab item.

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

Demonstrates tab items with a numeric badge and a custom badge color.

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

Set the default active tab with activePanel, and use the extra slot to add extra content to the tab header.

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

Set outline to none to remove the outline of the tab content area.

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

Demonstrates a custom panel color for a tab item.

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

Customize the style of the tab content area with contentStyle, for example a fixed height and scrolling.

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

Enable autoPlay to automatically carousel the tab contents; the interval can be adjusted with autoSpeed.

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

Set fillContainer to make the tab component fill the height of its parent container.

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
