通用卡片容器构件。

```html preview
<containers.general-card card-title="卡片标题">Content</containers.general-card>
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
        - brick: containers.general-card
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
- brick: containers.general-card
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

### Extra Slot

```yaml preview
- brick: containers.general-card
  properties:
    cardTitle: 卡片标题
    hasExtraSlot: true
  slots:
    extra:
      bricks:
        - brick: div
          properties:
            textContent: Extra Div
```

### Footer slot

```yaml preview
- brick: containers.general-card
  properties:
    cardTitle: 卡片标题
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
    footer:
      bricks:
        - brick: div
          properties:
            textContent: Footer Div
            style:
              padding: 5px 20px
              borderTop: "1px solid #ddd"
```

### Header Style

```yaml preview
- brick: containers.general-card
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
- brick: containers.general-card
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
- brick: containers.general-card
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
