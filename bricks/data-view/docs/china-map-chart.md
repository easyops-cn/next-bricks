中国地图图表构件，可以显示省级指标数据

已废弃，请使用 [`data-view.china-map`](./china-map)。

## Examples

### Basic

```yaml preview height="600px"
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

### Fill container

```yaml preview height="600px"
brick: div
properties:
  style:
    height: calc(100vh - 4em)
    position: relative
children:
  - brick: data-view.china-map-chart
    properties:
      fillContainer: true
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

### Province map

```yaml preview height="600px"
brick: div
properties:
  style:
    height: calc(100vh - 4em)
    position: relative
children:
  - brick: data-view.china-map-chart
    properties:
      fillContainer: true
      province: 广东
      dataSource:
        - text: "广州 12311"
          city: 广州
        - text: "深圳 89781169"
          city: 深圳
        - text: "湛江 234181"
          city: 湛江
    # Currently this brick only looks well within dark theme
    lifeCycle:
      onPageLoad:
        action: theme.setTheme
        args:
          - dark-v2
```

### With detail

```yaml preview height="600px"
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
