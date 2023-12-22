面包屑容器

## Examples

### Basic

```yaml preview
brick: eo-breadcrumb
children:
  - brick: span
    slot: separator
    properties:
      textContent: "/"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 事件中心
    children:
      - brick: eo-icon
        slot: prefix
        properties:
          lib: easyops
          category: app
          icon: monitor-alarm-notice
          style:
            font-size: 14px
      - brick: span
        slot: separator
        properties:
          textContent: ">"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 告警规则
  - brick: eo-breadcrumb-item
    properties:
      textContent: 编辑
```

### Slot

```yaml preview
brick: eo-breadcrumb
children:
  - brick: span
    slot: separator
    properties:
      textContent: "/"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 事件中心
    children:
      - brick: eo-icon
        slot: prefix
        properties:
          lib: easyops
          category: app
          icon: monitor-alarm-notice
          style:
            font-size: 14px
      - brick: span
        slot: separator
        properties:
          textContent: ">"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 告警规则
    children:
      - brick: span
        slot: separator
        properties:
          textContent: ">"
  - brick: eo-breadcrumb-item
    properties:
      textContent: 编辑
```
