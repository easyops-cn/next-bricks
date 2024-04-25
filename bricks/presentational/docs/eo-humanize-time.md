人性化时间展示

## Examples

### 完整

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: full
    value: 1714026348
```

### 精确

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: accurate
    value: 1714026348
```

### 相对

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: relative
    isMicrosecond: true
    value: 1714026348000
```

### 耗时

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: relative
    isCostTime: true
    value: 1000
```

### 链接

```yaml preview
- brick: eo-humanize-time
  properties:
    formatter: full
    link:
      target: _blank
      url: /aaa/bbb
    value: 1714026348
```

### 自定义格式

```yaml preview
- brick: eo-humanize-time
  properties:
    inputFormat: YYYY-MM-DD
    outputFormat: LLL
    value: "2020-02-27 16:36"
```
