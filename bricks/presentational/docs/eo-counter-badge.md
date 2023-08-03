通用徽标构件。

```yaml preview
- brick: eo-counter-badge
  properties:
    textContent: 我的通知
    count: 15
    overflowCount: 99
```

## Examples

### Basic

```yaml preview
- brick: eo-counter-badge
  properties:
    textContent: 我的通知
    count: 15
    overflowCount: 99
```

### slot

```yaml preview
- brick: eo-counter-badge
  properties:
    showZero: true
    count: 100
  children:
    - brick: div
      properties:
        style:
          font-size: 16px
        textContent: 我的待办
```

### icon

```yaml preview
- brick: eo-counter-badge
  properties:
    showZero: false
    count: 99
    dot: false
    icon:
      lib: antd
      theme: outlined
      icon: star
```

### dot 样式

```yaml preview
- brick: eo-counter-badge
  properties:
    showZero: false
    count: 99
    dot: true
    textContent: 统计总数
```

### 自定义徽标颜色

```yaml preview
- brick: eo-counter-badge
  properties:
    textContent: 已解决问题
    color: var(--theme-green-color)
    count: 1000000
    overflowCount: 500
```
