通用描述列表构件。

```yaml preview
- brick: presentational.general-descriptions
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
- brick: presentational.general-descriptions
  properties:
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
  properties:
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
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
          - brick: basic.general-tag-list
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
- brick: presentational.general-descriptions
  properties:
    dataSource:
      text: Hello world
    list:
      - label: 姓名
        text: Tom
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
