人性化时间展示

## Examples

### 人性化时间展示（完整）

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: full
    value: 1571017058
```

### 人性化时间展示（精确）

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: accurate
    isCostTime: true
    value: 1571017058
```

### 人性化时间展示（相对）

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: relative
    isMicrosecond: true
    value: 1571017058000
```

### 人性化时间展示（耗时）

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: relative
    isCostTime: true
    value: 1000
```

### 示例 5

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: full
    link:
      target: _blank
      url: /aaa/bbb
    value: 1571017058
```

### 示例 6

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: full
    value: 0
```

### 人性化时间展示（格式化）

```yaml preview
- brick: eo-humanize-time
  properties:
    inputFormat: YYYY-MM-DD
    outputFormat: YYYY-MM-DD
    value: "2020-02-27 16:36"
```
