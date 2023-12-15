通用卡片容器构件。

```html preview
<eo-card card-title="卡片标题">Content</eo-card>
```

## Examples

### Fill Vertical

```yaml preview
- brick: div
  properties:
    style:
      width: 100%
      height: 200px
      background: "#ddd"
      padding: 20px
  slots:
    "":
      bricks:
        - brick: eo-card
          properties:
            cardTitle: 卡片标题
            fillVertical: true
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: Content
```

### Vertical Center

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    verticalCenter: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
            style:
              height: 50px
```

### Hide Split

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    split: false
  slots:
    "":
      bricks:
        - brick: eo-next-table
          properties:
            scrollConfig:
              x: false
            pagination:
              pageSizeOptions:
                - 5
                - 10
                - 20
            columns:
              - dataIndex: name
                key: name
                title: Name
              - dataIndex: age
                key: age
                title: Age
              - dataIndex: address
                key: address
                title: Address
              - dataIndex: remarks
                key: remarks
                title: Long Column Long Column Long Column Long Column
                width: 200
                ellipsis: true
            dataSource:
              pageSize: 5
              page: 1
              list:
                - key: 0
                  name: Jack
                  age: 18
                  address: Guangzhou
                  remarks: Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text
                - key: 1
                  name: Alex
                  age: 20
                  address: Shanghai
                  remarks: Long text Long text
                - key: 2
                  name: Lucy
                  age: 16
                  address: Yunnan
                - key: 3
                  name: Sam
                  age: 28
                  address: Guangzhou
                  remarks: Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text
                - key: 4
                  name: Bob
                  age: 35
                  address: Hainan
                - key: 5
                  name: Ava
                  age: 23
                  address: Beijing
                - key: 6
                  name: Sophia
                  age: 20
                  address: Shanghai
                - key: 7
                  name: Charlotte
                  age: 33
                  address: Chongqing
                - key: 8
                  name: Mia
                  age: 18
                  address: Chengdu
                - key: 9
                  name: Noah
                  age: 38
                  address: Hainan
                - key: 10
                  name: William
                  age: 16
                  address: Taiwan
```

### Extra Slot

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    hasExtraSlot: true
  slots:
    extra:
      bricks:
        - brick: eo-button
          properties:
            textContent: Extra Button
```

### titleSuffix Slot

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
  slots:
    titleSuffix:
      bricks:
        - brick: eo-button
          properties:
            icon:
              lib: antd
              category: filled
              icon: info-circle
            type: icon
            tooltip: 首页
```

### Header Icon

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    headerIcon:
      lib: antd
      icon: search
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Header Style

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    headerStyle:
      background: "#abc"
      color: "#fff"
      fontSize: 22px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Background

```yaml preview
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    background: false
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
- brick: div
  properties:
    style:
      height: 10px
- brick: eo-card
  properties:
    cardTitle: 卡片标题
    background: "#abc"
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
```

### Outline

```yaml preview gap
- brick: div
  properties:
    style:
      display: grid
      flexDirection: column
      gap: 1em
  children:
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        textContent: "outline: (not set)"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        outline: border
        textContent: "outline: border"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        outline: shadow
        textContent: "outline: shadow"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        outline: background
        background: var(--color-fill-bg-base-4)
        textContent: "outline: background"
```
