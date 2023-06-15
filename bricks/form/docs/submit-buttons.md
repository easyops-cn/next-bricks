表单提交按钮。
(tips: 通常在于 form.general-form 构件搭配使用)

```yaml preview
- brick: form.submit-buttons
```

## Examples

### Submit Button Text & Cancel Button Text

```yaml preview
- brick: form.submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
```

### Disabled After Click & Submit Button Disabled

```yaml preview
- brick: form.submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
    submitDisabled: true
- brick: form.submit-buttons
  properties:
    submitText: click to disabled
    cancelText: cancel
    disableAfterClick: true
```

### Type

```yaml preview
- brick: form.submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
    submitType: primary
    cancelType: text
- brick: form.submit-buttons
  properties:
    submitText: click to disabled
    cancelText: cancel
    submitType: text
    cancelType: text
```

### Event

```yaml preview
- brick: form.submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
  events:
    submit:
      - action: message.success
        args:
          - Submit
    cancel:
      - action: message.warn
        args:
          - Cancel
```
