大屏仪表盘构件

## Examples

### Basic

```yaml preview
- brick: data-view.gauge-chart
  properties:
    value: 100
    radius: 180
    strokeWidth: 20
    description: 已部署 1490 个 / 3300个
  slots:
    "":
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 已部署 1490 个 / 3300个
            style:
              font-size: 16px
              font-weight: 500
              color: "#fff"
              margin: 0 0 300px 0
```
