构件 `eo-app-bar-wrapper`

## Examples

### Basic

```yaml preview
- brick: eo-app-bar-wrapper
  slots:
    leftContainer:
      bricks:
        - brick: div
          properties:
            textContent: leftContent
      type: bricks
    rightContainer:
      bricks:
        - brick: div
          properties:
            textContent: rightContent
      type: bricks
```

### DisplayCenter

```yaml preview
- brick: eo-app-bar-wrapper
  properties:
    displayCenter: true
  slots:
    leftContainer:
      bricks:
        - brick: div
          properties:
            textContent: leftContent
      type: bricks
    rightContainer:
      bricks:
        - brick: div
          properties:
            textContent: rightContent
      type: bricks
```
