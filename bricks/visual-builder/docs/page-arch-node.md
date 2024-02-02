构件 `visual-builder.page-arch-node`

## Examples

### Basic

```yaml preview
brick: visual-builder.page-arch-node
properties:
  label: 名称
  type: page
```

### With SubNodes

```yaml preview
brick: visual-builder.page-arch-node
properties:
  label: 列表
  type: page
  subNodes:
    - label: 详情
      id: detail
```
