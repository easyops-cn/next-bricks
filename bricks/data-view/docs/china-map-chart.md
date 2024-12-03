中国地图图表构件，可以显示省级指标数据

## Examples

### Basic

```yaml preview
brick: data-view.china-map-chart
properties:
  dataSource:
    - text: "西藏 12311"
      city: 西藏
    - text: "四川 89781169"
      city: 四川
    - text: "台湾 234181"
      city: 台湾
    - text: "江西 21348"
      city: 江西
# Currently this brick only looks well within dark theme
lifeCycle:
  onPageLoad:
    action: theme.setTheme
    args:
      - dark-v2
```

### With detail

```yaml preview
brick: data-view.china-map-chart
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
events:
  detail.open.change:
    - action: console.log
slots:
  detail:
    bricks:
      - brick: div
        properties:
          textContent: 内容区
# Currently this brick only looks well within dark theme
lifeCycle:
  onPageLoad:
    action: theme.setTheme
    args:
      - dark-v2
```
