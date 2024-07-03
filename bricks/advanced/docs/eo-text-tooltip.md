构件 `eo-text-tooltip`

## Examples

### Basic

```yaml preview
brick: div
properties:
  style:
    display: flex
    flex-direction: column
    gap: 16px
children:
  - brick: eo-text-tooltip
    properties:
      style:
        width: 180px
      label: 不省略不省略不省略不省略不省略不省略不省略不省略不省略不省略不省略不省略
      lineClamp: 0
  - brick: eo-text-tooltip
    properties:
      style:
        width: 180px
      label: 单行不超出不显示tips
      lineClamp: 1
  - brick: eo-text-tooltip
    properties:
      style:
        width: 180px
      label: 单行超出省略显示tips单行超出省略显示tips单行超出省略显示tips
      lineClamp: 1
```
