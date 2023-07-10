构件 `data-view.dot-view`

## Examples

### Basic

```yaml preview
- brick: data-view.dot-view
  slots:
    titleBar:
      type: bricks
      bricks:
        - brick: data-view.modern-style-page-title
          properties:
            pageTitle: 网络监控
    content:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 内容
```
