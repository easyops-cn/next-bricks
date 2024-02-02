表单提交按钮。
(tips: 通常在于 eo-form 构件搭配使用)

```yaml preview
- brick: eo-submit-buttons
```

## Examples

### Basic

```yaml preview
- brick: eo-submit-buttons
  properties:
    submitText: Submit
    cancelText: Cancel
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

### Button types

```yaml preview
- brick: eo-submit-buttons
  properties:
    submitText: Submit
    cancelText: Cancel
    submitType: primary
    cancelType: default
```

### Disable submit button

```yaml preview
- brick: eo-submit-buttons
  properties:
    submitText: Submit
    cancelText: Cancel
    submitDisabled: true
```
