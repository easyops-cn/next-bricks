构件 `eo-color-picker`

## Examples

### Basic

```yaml preview
brick: eo-color-picker
events:
  change:
    action: console.log
```

### Size

```yaml preview
- brick: eo-flex-layout
  properties:
    justifyContent: start
    gap: 20px
  slots:
    "":
      bricks:
        - brick: eo-color-picker
          properties:
            size: small
            value: red
        - brick: eo-color-picker
          properties:
            size: medium
            value: "#36b545"
        - brick: eo-color-picker
          properties:
            size: large
            value: rgb(59, 52, 255)
```

### ShowText

```yaml preview
- brick: eo-color-picker
  properties:
    showText: true
  events:
    change:
      action: console.log
```

### AllowClear

```yaml preview
- brick: eo-color-picker
  properties:
    allowClear: true
    defaultValue: "#f5a623"
  events:
    change:
      action: console.log
```

### Formats

```yaml preview
- brick: eo-flex-layout
  properties:
    justifyContent: start
    gap: 20px
  slots:
    "":
      bricks:
        - brick: eo-color-picker
          properties:
            format: hex
            value: "#FCFA0E"
        - brick: eo-color-picker
          properties:
            format: rgb
            value: rgb(80, 227, 194)
        - brick: eo-color-picker
          properties:
            format: hsb
            value: hsb(215, 91%, 100%)
```

### With Form

```yaml preview
- brick: form.general-form
  events:
    validate.success:
      - action: console.log
    validate.error:
      - action: console.log
  slots:
    "":
      type: bricks
      bricks:
        - brick: eo-color-picker
          properties:
            name: color
            label: 颜色
            required: true
            defaultValue: "#1677FF"
            showText: true
          events:
            change:
              action: console.log
        - brick: eo-submit-buttons
```
