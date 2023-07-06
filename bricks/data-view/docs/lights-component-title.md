构件 `data-view.lights-component-title`

## Examples

### Light

```yaml preview
- brick: div
  properties:
    style:
      width: 100%
      height: 100%
      background: "#000000FF"
  slots:
    "":
      type: bricks
      bricks:
        - brick: data-view.lights-component-title
          properties:
            componentTitle: 标题内容
            theme: "light"
```
### Dark

```yaml preview
- brick: div
  properties:
    style:
      width: 100%
      height: 100%
      background: "#000000FF"
  slots:
    "":
      type: bricks
      bricks:
        - brick: data-view.lights-component-title
          properties:
            componentTitle: 标题内容
            theme: "dark"
```
