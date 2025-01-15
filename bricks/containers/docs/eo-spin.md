加载中

## Examples

### Basic

```yaml preview
brick: eo-spin
properties:
  spinning: true
  size: default
  tip: 加载中...
slots:
  "":
    type: bricks
    bricks:
      - brick: eo-descriptions
        properties:
          column: 3
          list:
            - label: 姓名
              text: Tom
            - label: 年龄
              text: 18
            - label: 身高
              text: 180cm
            - label: 爱好
              text: 篮球
            - label: 标签
              useBrick:
                - brick: eo-tag-list
                  properties:
                    list:
                      - text: 阳光
                        key: 0
                        color: blue
                      - text: 开朗
                        key: 1
                        color: red
                      - text: 大男孩
                        key: 2
                        color: green
```
