大屏基础下拉菜单

## Examples

### Basic

```yaml preview
- brick: data-view.dropdown-menu
  properties:
    options:
      - label: 测试1
        value: test1
      - label: 测试2
        value: test2
    placeholder: 请选择
    allowClear: true
  events:
    value.change:
      - action: console.log
```
