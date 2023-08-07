面包屑容器

## Examples

### Basic

```yaml preview
brick: eo-breadcrumb
slots:
  separator:
    bricks:
      - brick: span
        properties:
          textContent: "/"
  "":
    bricks:
      - brick: eo-breadcrumb-item
        properties:
          textContent: 事件中心
        slots:
          prefix:
            bricks:
              - brick: eo-icon
                properties:
                  lib: easyops
                  category: app
                  icon: monitor-alarm-notice
                  style:
                    font-size: 14px
          separator:
            bricks:
              - brick: span
                properties:
                  textContent: ">"
      - brick: eo-breadcrumb-item
        properties:
          textContent: 告警规则
      - brick: eo-breadcrumb-item
        properties:
          textContent: 编辑
```
