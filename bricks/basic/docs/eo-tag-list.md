通用标签列表构件

```yaml preview
- brick: eo-tag-list
  properties:
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

## Examples

### Closable

```yaml preview
- brick: eo-tag-list
  properties:
    closable: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
  events:
    close:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Checkable

```yaml preview
- brick: eo-tag-list
  properties:
    checkable: true
    list:
      - text: Item A
        key: Item A
      - text: Default checked item
        key: Item B
        checked: true
      - text: Item C
        key: Item C
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Multiple

```yaml preview
- brick: eo-tag-list
  properties:
    multiple: true
    checkable: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-tag-list
  properties:
    multiple: false
    checkable: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

### Disabled

```yaml preview
- brick: eo-tag-list
  properties:
    closable: true
    checkable: true
    disabled: true
    mulitple: true
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
        disabled: false
      - text: Item C
        key: Item C
      - text: Item D
        key: Item D
        disabled: false
```

### Size

```yaml preview
- brick: eo-tag-list
  properties:
    size: large
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
- brick: eo-tag-list
  properties:
    size: medium
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
    style:
      margin: 0 10px
- brick: eo-tag-list
  properties:
    size: small
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
      - text: Item C
        key: Item C
```

### Color

```yaml preview
- brick: eo-tag-list
  properties:
    mulitple: true
    list:
      - text: Item A
        key: Item A
        color: red
      - text: Item B
        key: Item B
        color: red-inverse
      - text: Item C
        key: Item C
        color: yellow
      - text: Item D
        key: Item D
        color: blue-inverse
      - text: Custom Color Item
        key: Custom Color Item
        color: "#abc"
```

### TagStyle

```yaml preview
- brick: eo-tag-list
  properties:
    list:
      - text: Item A
        key: Item A
      - text: Item B
        key: Item B
        tagStyle:
          color: green
      - text: Item C
        key: Item C
    tagStyle:
      color: red
```
