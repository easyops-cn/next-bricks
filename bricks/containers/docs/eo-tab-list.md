通用 Tab 容器。

## Examples

### Tabs

```yaml preview
- brick: eo-tab-list
  properties:
    tabs:
      - text: Create
        panel: Create
      - text: Edit
        panel: Edit
        icon:
          lib: "antd"
          icon: "edit"
          theme: "filled"
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

### Panel Type

```yaml preview
- brick: eo-tab-list
  properties:
    type: panel
    tabs:
      - text: Tab 1
        panel: tab-1
      - text: Tab 2
        panel: tab-2
        icon:
          lib: "antd"
          icon: "edit"
          theme: "filled"
  slots:
    tab-1:
      bricks:
        - brick: div
          properties:
            textContent: Tab 1 Content
    tab-2:
      bricks:
        - brick: div
          properties:
            textContent: Tab 2
```

### With Badge

```yaml preview
- brick: eo-tab-list
  properties:
    tabs:
      - text: Tab 1
        panel: tab-1
        badgeConf:
          count: 100
      - text: Tab 2
        panel: tab-2
        icon:
          lib: "antd"
          icon: "edit"
          theme: "filled"
  slots:
    tab-1:
      bricks:
        - brick: div
          properties:
            textContent: Tab 1 Content
    tab-2:
      bricks:
        - brick: div
          properties:
            textContent: Tab 2
```

### ActivePanel & Extra

```yaml preview
- brick: eo-tab-list
  properties:
    activePanel: Edit
    tabs:
      - text: Create
        panel: Create
      - text: Edit
        panel: Edit
        icon:
          lib: "antd"
          icon: "edit"
          theme: "filled"
      - text: "Delete"
        panel: "Delete"
        disabled: true
      - text: "Query"
        panel: "Query"
        hidden: true
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
    extra:
      bricks:
        - brick: basic.general-button
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

### panelStyle

```yaml preview
- brick: eo-tab-list
  properties:
    panelStyle:
      background: none
      margin-left: 24px
    type: panel
    tabs:
      - Item A
      - Item B
      - Item C
    showCard: false
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
