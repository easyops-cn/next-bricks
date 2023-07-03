构件 tabs-page-title

## Examples

### Basic

```yaml preview
- brick: data-view.tabs-page-title
  properties:
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

### TabList

```yaml preview
- brick: data-view.tabs-page-title
  properties:
    tabList:
      - text: 标签1
        key: key1
      - text: 标签2
        key: key2
      - text: 标签3
        key: key3
      - text: 标签4
        key: key4
      - text: 标签5
        key: key5
      - text: 标签6
        key: key6
    activeKey: key2
  slots:
    "":
      type: bricks
      bricks:
        - brick: data-view.title-text
          properties:
            text: 大标题
            type: gradient
    key1:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标签一内容
    key2:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标签二内容
    key3:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标签三内容
    key4:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标签四内容
    key5:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标签五内容
    key6:
      type: bricks
      bricks:
        - brick: div
          properties:
            textContent: 标签六内容
```
