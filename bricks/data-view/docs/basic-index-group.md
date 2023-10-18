构件 `data-view.basic-index-group`

## Examples

### Basic

```yaml preview
- brick: div
  properties:
    textContent: 左右布局，有描述，不换行
- brick: data-view.basic-index-group
  properties:
    width: 1000
    style:
      margin-top: 20px
    itemList:
      - type: host
        title: 主机
        number: 289
        description: 较昨日增长24.5%
        trendIcon: up
      - type: cloud
        title: 容器
        number: 24
        description: 较昨日下降10.2%
        trendIcon: down
      - type: network
        title: 网络设施
        number: 24
        description: 较昨日下降10.2%
        trendIcon: down
      - type: database
        title: 数据库
        number: 24
        description: 较昨日下降10.2%
        trendIcon: down
- brick: div
  properties:
    textContent: 左右布局，有描述，换行
    style:
      margin-top: 20px
- brick: data-view.basic-index-group
  properties:
    width: 500
    style:
      margin-top: 20px
    itemList:
      - type: host
        title: 主机
        number: 289
        description: 较昨日增长24.5%
        trendIcon: up
      - type: cloud
        title: 容器
        number: 24
        description: 较昨日下降10.2%
        trendIcon: down
      - type: network
        title: 网络设施
        number: 24
        description: 较昨日下降10.2%
        trendIcon: down
      - type: database
        title: 数据库
        number: 24
        description: 较昨日下降10.2%
        trendIcon: down
- brick: div
  properties:
    textContent: 左右布局，无描述
    style:
      margin-top: 20px
- brick: data-view.basic-index-group
  properties:
    width: 500
    gap: 48
    style:
      margin-top: 20px
    itemList:
      - type: host
        title: 主机
        number: 289
      - type: cloud
        title: 容器
        number: 24
      - type: network
        title: 网络设施
        number: 24
      - type: database
        title: 数据库
        number: 24
- brick: div
  properties:
    textContent: 上下布局
    style:
      margin-top: 20px
- brick: data-view.basic-index-group
  properties:
    width: 1000
    layout: top-bottom
    gap: 48
    style:
      margin-top: 20px
    itemList:
      - type: host
        title: 主机
        number: 289
      - type: cloud
        title: 容器
        number: 24
      - type: network
        title: 网络设施
        number: 24
      - type: database
        title: 数据库
        number: 24
```
