通用 Tab 容器。

## Example

```yaml preview
- brick: containers.tab-list
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

### ActivePanel & Extra

```yaml preview
- brick: containers.tab-list
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

### ShowCard

```yaml preview
- brick: containers.tab-list
  properties:
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
