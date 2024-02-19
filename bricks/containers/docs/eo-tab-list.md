通用 Tab 容器。

## Examples

### Tabs

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
