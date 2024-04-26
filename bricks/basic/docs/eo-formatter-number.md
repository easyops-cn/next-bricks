数字格式化，支持普通数字、货币、百分比、二进制字节等数字的格式化显示。

## Examples

### Basic

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
```

### Currency

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
  type: currency
```

### Percent

```yaml preview
brick: eo-formatter-number
properties:
  value: 0.314159265
  type: percent
```

### Bytes

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159265
  type: unit
  decimals: 2
  originalUnit: KiB
```

### Fallback

```yaml preview
brick: eo-formatter-number
properties:
  fallback: "-"
```

### Customizations

```yaml preview
brick: eo-formatter-number
properties:
  value: 314159.265
  thousandsSeparator: false
  decimals: 2
```
