通用分类容器构件。

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

## Examples

### Content Style

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
    contentStyle:
      background: "#abc"
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

### Header Style

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
    headerStyle:
      background: "#abc"
      padding: 10px 20px
      marginTop: 20px
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```

### Container Style

```yaml preview
- brick: eo-category
  properties:
    categories:
      - title: Item 1
        key: Item 1
      - title: Item 2
        key: Item 2
    containerStyle:
      background: "#abc"
      padding: 10px 20px
      borderRadius: 8px
  slots:
    "Item 1":
      bricks:
        - brick: div
          properties:
            textContent: Item 1 Content
    "Item 2":
      bricks:
        - brick: div
          properties:
            textContent: Item 2 Content
```
