构件 `data-view.hi-tech-button`

## Examples

### Basic

```yaml preview
- brick: data-view.hi-tech-button
  slots:
    "":
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: BUTTON
```

### Parallelogram

```yaml preview
- brick: data-view.hi-tech-button
  properties:
    type: parallelogram
  slots:
    "":
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: BUTTON
```

### Stereoscopic

```yaml preview
- brick: data-view.hi-tech-button
  properties:
    type: stereoscopic
  slots:
    "":
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: BUTTON
```

### Shading

```yaml preview
- brick: data-view.hi-tech-button
  properties:
    type: shading
  slots:
    "":
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: BUTTON
```

### Round

```yaml preview
- brick: data-view.hi-tech-button
  properties:
    type: round
  slots:
    "":
      type: bricks
      bricks:
        - brick: span
          properties:
            textContent: BUTTON
```

### Click

```yaml preview
- brick: data-view.hi-tech-button
  properties:
    textContent: BUTTON
  events:
    click:
      action: message.success
      args:
        - Click!
```
