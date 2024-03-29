data-view.tabs-drawer

## Examples

### Basic

```yaml preview
- brick: data-view.tabs-drawer
  properties:
    activeKey: search
    id: drawer
    visible: true
    width: 800
    style:
      height: 600px
      display: block
    tabList:
      - tooltip: 搜索
        key: search
        icon:
          lib: fa
          icon: search
          prefix: fas
      - tooltip: 内容
        key: app
        icon:
          lib: easyops
          category: app
          icon: micro-app-configuration

      - tooltip: 图表
        key: chart
        icon:
          lib: fa
          icon: ad
          prefix: fas
  slots:
    search:
      type: bricks
      bricks:
        - brick: div
          properties:
            style:
              padding: 0 16px
              height: 100px
              background: red
            textContent: 测试
    app:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 内容区域
            style:
              background: yellow
              height: 100px
    chart:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 图表区域
            style:
              background: green
              height: 100px
  events:
    close:
      - action: console.log
    tab.change:
      - action: console.log
```
