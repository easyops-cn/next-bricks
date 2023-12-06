图标选择器

## Examples

### Basic

```yaml preview minHeight="750px"
- brick: eo-icon-select
  events:
    change:
      action: console.log
      args:
        - "<% EVENT.detail %>"
```

### With Form

```yaml preview minHeight="750px"
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-icon-select
      properties:
        name: icon
        label: 图标
        required: true
    - brick: eo-submit-buttons
```
