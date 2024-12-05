中间是地球的数据展示构件。

## Examples

### Basic

```yaml preview height="660px"
brick: div
properties:
  style:
    height: calc(100vh - 2em)
children:
  - brick: data-view.globe-earth-indicator
    properties:
      centerDataSource:
        label: 资产总数
        value: 30123
      dataSource:
        - label: 低值易耗品
          value: 3889
        - label: 摊销资产
          value: 2087
        - label: 固定资产
          value: 12088
        - label: 无形资产
          value: 1082
        - label: 在建工程
          value: 10997
      cornerDataSource:
        - label: 资产增长
          value: 43
          color: red
        - label: 资产减少
          value: 21
          color: green
    # Currently this brick only works within dark theme
    lifeCycle:
      onPageLoad:
        action: theme.setTheme
        args:
          - dark-v2
```
