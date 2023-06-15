表单输入框构件。

```yaml preview
- brick: form.general-input
```

## Examples

### Label

```yaml preview
- brick: form.general-input
  properties:
    label: 输入框
```

### Value

```yaml preview
- brick: form.general-input
  properties:
    value: Default Value
```

### Disabled

```yaml preview
- brick: form.general-input
  properties:
    value: Default Value
    disabled: true
```

### Clearable

```yaml preview
- brick: form.general-input
  properties:
    value: Default Value
    clearable: true
```

### Placeholder

```yaml preview
- brick: form.general-input
  properties:
    placeholder: This is placeholder...
```

### max length

```yaml preview
- brick: form.general-input
  properties:
    placeholder: max length = 5
    maxLength: 5
```

### Type

```yaml preview
- brick: form.general-input
  properties:
    label: password
    type: password
- brick: form.general-input
  properties:
    label: date
    type: date
- brick: form.general-input
  properties:
    label: color
    type: color
- brick: form.general-input
  properties:
    label: search
    type: search
```

### Size

```yaml preview
- brick: form.general-input
  properties:
    size: large
    placeholder: large
- brick: form.general-input
  properties:
    size: medium
    placeholder: medium
- brick: form.general-input
  properties:
    size: small
    placeholder: small
```

### Input Style

```yaml preview
- brick: form.general-input
  properties:
    placeholder: "width: 180px"
    inputStyle:
      width: 180px
- brick: form.general-input
  properties:
    placeholder: "width: 250px"
    inputStyle:
      width: 250px
- brick: form.general-input
  properties:
    placeholder: "border style"
    inputStyle:
      border: "1px solid #8b2121"
```

### Event

```yaml preview
- brick: form.general-input
  events:
    label: Event
    change:
      action: message.success
      args:
        - <% EVENT.detail %>
    focus:
      action: message.success
      args:
        - focus
    blur:
      action: message.success
      args:
        - blur
```

### Slot

```yaml preview
- brick: form.general-input
  properties:
    placeholder: prefix slot
  slots:
    prefix:
      bricks:
        - brick: icons.general-icon
          properties:
            icon: search
            lib: antd
            theme: outlined
- brick: form.general-input
  properties:
    placeholder: suffix slot
  slots:
    suffix:
      bricks:
        - brick: icons.general-icon
          properties:
            icon: search
            lib: antd
            theme: outlined
```
