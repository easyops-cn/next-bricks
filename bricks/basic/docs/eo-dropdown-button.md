通用下拉按钮构件。

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    actions:
      - text: Item 1
      - text: Item 2
```

## Examples

### Type

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    type: primary
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    type: dashed
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    type: text
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    type: link
    actions:
      - text: Item 1
      - text: Item 2
```

### Button Text & Icon

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    btnText: 下拉按钮
    icon:
      icon: search
      lib: antd
      theme: outlined
    actions:
      - text: Item 1
      - text: Item 2
```

### Size

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    size: large
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    size: medium
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    size: small
    actions:
      - text: Item 1
      - text: Item 2
```

### Disabled

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    disabled: true
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    btnText: ""
    shape: circle
    icon:
      icon: setting
      lib: antd
      theme: filled
    actions:
      - text: Item 1
        disabled: true
      - text: Item 2
```

### Actions & Event

```yaml preview minHeight="200px"
- brick: eo-dropdown-button
  properties:
    icon:
      icon: search
      lib: antd
      theme: outlined
    actions:
      - text: Query
        icon:
          icon: search
          lib: antd
          theme: outlined
        event: "query"
      - text: Edit
        icon:
          lib: "easyops"
          category: "default"
          icon: "edit"
        event: "edit"
      - text: Delete
        icon:
          lib: "easyops"
          category: "default"
          icon: "delete"
        event: "delete"
  events:
    query:
      - action: message.success
        args:
          - click query button
    edit:
      - action: message.warn
        args:
          - click edit button
    delete:
      - action: message.error
        args:
          - click delete button
```
