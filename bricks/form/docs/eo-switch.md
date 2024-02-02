开关构件

## Examples

### Basic

```yaml preview
- brick: eo-switch
  events:
    switch:
      action: console.log
  properties:
    disabled: false
```

### Label

```yaml preview
- brick: eo-switch
  events:
    switch:
      action: console.log
  properties:
    disabled: false
    label: switch
```

### disabled

```yaml preview
- brick: eo-switch
  properties:
    disabled: true
    value: true
    label: switch
```

### size

```yaml preview
- brick: eo-switch
  properties:
    disabled: false
    value: true
    label: switch
    size: small
```

### Customizations

```yaml preview
- brick: eo-switch
  properties:
    checkedText: 123
    unCheckedText: 456
    disabled: false
    size: small
    label: text
    checkedIcon:
      icon: plus-circle
      lib: antd
      theme: outlined
    unCheckedIcon:
      icon: plus-circle
      lib: antd
```

### Event

```yaml preview
- brick: eo-switch
  events:
    switch:
      action: console.log
  properties:
    disabled: false
```

### With Form

```yaml preview
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-switch
      properties:
        name: switch
        label: 开关
    - brick: eo-submit-buttons
```
