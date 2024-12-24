构件 `data-view.china-map`

## Examples

### Basic

```yaml preview height="600px"
brick: div
properties:
  style:
    height: calc(100vh - 4em)
    position: relative
children:
  - brick: data-view.china-map
    properties:
      dataSource:
        - text: "西藏 12311"
          province: 西藏
        - text: "四川 89781169"
          province: 四川
        - text: "台湾 234181"
          province: 台湾
        - text: "江西 21348"
          province: 江西
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
  - brick: data-view.china-map
    properties:
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
