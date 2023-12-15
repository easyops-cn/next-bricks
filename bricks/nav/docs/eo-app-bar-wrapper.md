构件 `eo-app-bar-wrapper`

## Examples

### Basic

```yaml preview
- brick: eo-app-bar-wrapper
  properties:
    position: static
  slots:
    left:
      bricks:
        - brick: div
          properties:
            textContent: Left Content
      type: bricks
    right:
      bricks:
        - brick: div
          properties:
            textContent: Right Content
      type: bricks
```

### DisplayCenter

```yaml preview
- brick: eo-app-bar-wrapper
  properties:
    position: static
    displayCenter: true
  slots:
    left:
      bricks:
        - brick: div
          properties:
            textContent: Left Content
      type: bricks
    right:
      bricks:
        - brick: div
          properties:
            textContent: Right Content
      type: bricks
```
