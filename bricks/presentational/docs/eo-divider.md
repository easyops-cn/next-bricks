分割线构件 `eo-divider`

## Examples

### Basic

```yaml preview
- brick: eo-divider
```

### orientation

```yaml preview
- brick: eo-divider
  properties:
    orientation: left
    textContent: 基本
```

### 虚线 dashed

```yaml preview
- brick: eo-divider
  properties:
    orientation: center
    textContent: 基本
    dashed: true
```

### type vertical

```yaml preview
- brick: span
  properties:
    textContent: span1
- brick: eo-divider
  properties:
    type: vertical
- brick: span
  properties:
    textContent: span2
```

### type radiation

```yaml preview
- brick: eo-divider
  properties:
    type: radiation
    textContent: 标题
    proportion:
      - 0
      - 3
```
