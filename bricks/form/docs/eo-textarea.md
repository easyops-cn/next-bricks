表单多行文本输入框构件。

```yaml preview
- brick: eo-textarea
```

## Examples

### Label

```yaml preview
- brick: eo-textarea
  properties:
    label: 多行输入框
```

### Value

```yaml preview
- brick: eo-textarea
  properties:
    value: Default Value
```

### Disabled

```yaml preview
- brick: eo-textarea
  properties:
    value: Default Value
    disabled: true
```

### Placeholder

```yaml preview
- brick: eo-textarea
  properties:
    placeholder: This is placeholder...
```

### max length

```yaml preview
- brick: eo-textarea
  properties:
    placeholder: max length = 10
    maxLength: 10
```

### AutoSize

```yaml preview
- brick: eo-textarea
  properties:
    placeholder: "autoSize: true"
    autoSize: true
- brick: eo-textarea
  properties:
    placeholder: "autoSize: { minRows: 3}"
    autoSize:
      minRows: 3
- brick: eo-textarea
  properties:
    placeholder: "autoSize: { minRows: 3, maxRows: 5}"
    autoSize:
      minRows: 3
      maxRows: 5
```

### Textarea Style

```yaml preview
- brick: eo-textarea
  properties:
    placeholder: "width: 180px"
    textareaStyle:
      width: 180px
- brick: eo-textarea
  properties:
    placeholder: "width: 250px"
    textareaStyle:
      width: 250px
- brick: eo-textarea
  properties:
    placeholder: "border style"
    textareaStyle:
      border: "1px solid #8b2121"
```

### Event

```yaml preview
- brick: eo-textarea
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
