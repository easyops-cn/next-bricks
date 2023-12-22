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
    hideSplit: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
            style:
              display: flex
              background: pink
              height: 200px
              alignItems: center
              justifyContent: center
              fontSize: 22px
              fontWeight: 500
              color: "#fff"
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
        - brick: eo-tooltip
          properties:
            content: This is a tooltip
            trigger: hover
          children:
            - brick: eo-icon
              properties:
                lib: antd
                category: filled
                icon: info-circle
                style:
                  height: 14px
                  lineHeight: 14px
                  fontSize: 14px
                  marginLeft: 6px
                  color: var(--color-normal-text)
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
        hideSplit: true
        textContent: "outline: border"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        hideSplit: true
        outline: shadow
        textContent: "outline: shadow"
    - brick: eo-card
      properties:
        cardTitle: 卡片标题
        outline: background
        background: var(--color-fill-bg-base-4)
        textContent: "outline: background"
```
