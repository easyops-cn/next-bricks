构件 `data-view.tech-mesh-base-view`

## Examples

### Basic TabsTitleBar

```yaml preview
- brick: data-view.tech-mesh-base-view
  properties:
    style:
      min-height: 800px
  slots:
    titleBar:
      type: bricks
      bricks:
        - brick: data-view.tabs-page-title
          slots:
            "":
              type: bricks
              bricks:
                - brick: data-view.title-text
                  properties:
                    text: 大标题
                    type: gradient
            start:
              type: bricks
              bricks:
                - brick: data-view.brick-notification
                  properties:
                    message: This is the content of the notification.
            end:
              type: bricks
              bricks:
                - brick: div
                  properties:
                    textContent: "2022/11/30 17:25 星期四"
                    style:
                      font-size: 16px
                      color: "#fff"
```

### Sample TitleBar

```yaml preview
- brick: data-view.tech-mesh-base-view
  properties:
    style:
      min-height: 800px
  slots:
    titleBar:
      type: bricks
      bricks:
        - brick: data-view.top-title-bar
          properties:
            text: 可视化大屏
            type: sample
```
