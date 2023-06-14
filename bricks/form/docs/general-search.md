搜索框

## Examples

### Basic

```yaml preview
- brick: form.general-search
  properties:
    placeholder: 请输入
    clearable: true
    trim: true
  events:
    change:
      action: console.log
      args:
        - "<% EVENT.detail %>"
    search:
      action: console.log
      args:
        - "<% EVENT.detail %>"
```
