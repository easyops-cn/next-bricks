表单提交按钮。
(tips: 通常在于 eo-form 构件搭配使用)

```yaml preview
- brick: eo-submit-buttons
```

## Examples

### Submit Button Text & Cancel Button Text

```yaml preview
- brick: eo-submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
```

### Disabled After Click & Submit Button Disabled

```yaml preview
- brick: eo-submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
    submitDisabled: true
- brick: eo-submit-buttons
  properties:
    submitText: click to disabled
    cancelText: cancel
    disableAfterClick: true
```

### Type

```yaml preview
- brick: eo-submit-buttons
  properties:
    submitText: submit
    cancelText: cancel
    submitType: primary
    cancelType: text
- brick: eo-submit-buttons
  properties:
    submitText: click to disabled
    cancelText: cancel
    submitType: text
    cancelType: text
```

### Event

```yaml preview
- brick: eo-submit-buttons
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
