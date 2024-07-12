通用描述列表构件。

```yaml preview
- brick: eo-descriptions
  properties:
    list:
      - label: 姓名
        text: Tom
      - label: 年龄
        text: 18
      - label: 身高
        text: 180cm
      - label: 爱好
        text: 篮球
```

## Examples

### Column

```yaml preview
- brick: eo-descriptions
  properties:
    descriptionTitle: UserInfo
    column: 2
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

- brick: eo-divider
  properties:
    dividerStyle:
      margin: 8px 0 4px 0
- brick: eo-descriptions
  properties:
    descriptionTitle: 用户信息
    column: 4
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

### Layout

```yaml preview
- brick: eo-descriptions
  properties:
    layout: horizontal
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
- brick: eo-divider
  properties:
    dividerStyle:
      margin: 8px 0 4px 0
- brick: eo-descriptions
  properties:
    layout: vertical
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
- brick: div
  properties:
    style:
      margin: 10px 0px
```

### Bordered

```yaml preview
- brick: eo-descriptions
  properties:
    bordered: true
    layout: vertical
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
- brick: div
  properties:
    style:
      margin: 10px 0px
- brick: eo-descriptions
  properties:
    bordered: true
    layout: horizontal
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

### Hide Groups

```yaml preview
- brick: eo-descriptions
  properties:
    hideGroups: other
    list:
      - label: 姓名
        text: Tom
      - label: 年龄
        text: 18
      - label: 身高
        text: 180cm
      - label: 爱好
        text: 篮球
        group: "other"
      - label: 标签
        group: "other"
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

- brick: div
  properties:
    style:
      margin: 10px 0px
- brick: eo-descriptions
  properties:
    hideGroups:
      - name
      - other
    list:
      - label: 姓名
        text: Tom
        group: name
      - label: 年龄
        text: 18
        group: age
      - label: 身高
        text: 180cm
      - label: 爱好
        text: 篮球
        group: other
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

### DataSource

```yaml preview
- brick: eo-descriptions
  properties:
    dataSource:
      text: Hello world
      name: Tom
    list:
      - label: 姓名
        field: name
      - label: 年龄
        text: 18
      - label: 身高
        text: 180cm
      - label: 爱好
        text: 篮球
      - label: Form dataSource
        useBrick:
          brick: div
          properties:
            textContent: "<% DATA.text %>"
```
