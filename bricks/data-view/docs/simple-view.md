构件 `data-view.simple-view`

## Examples

### Basic

```yaml preview
- brick: data-view.simple-view
  slots:
    toolBar:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 大标题
    content:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 内容
```
