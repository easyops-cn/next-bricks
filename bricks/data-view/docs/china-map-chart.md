构件 `data-view.china-map-chart`

## Examples

### Basic

```yaml preview
- brick: data-view.china-map-chart
  slots:
    detail:
      bricks:
        - brick: div
          properties:
            textContent: 内容区
  events:
    detail.open.change:
      - action: console.log
  properties:
    detailContentStyle:
      background: "yellow"
    dataSource:
      - text: "西藏 12311"
        detailDisplayLocation: "textBottom"
        city: 西藏
      - text: "四川 89781169"
        detailDisplayLocation: "textBottom"
        city: 四川
      - text: "台湾 234181"
        detailDisplayLocation: "pageCenter"
        city: 台湾
      - text: "江西 21348"
        detailDisplayLocation: "pageCenter"
        city: 江西
```
