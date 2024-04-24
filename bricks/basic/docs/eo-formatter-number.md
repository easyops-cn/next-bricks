构件 `eo-formatter-number`

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
  thousandsSeparators: false
  decimals: 2
```
