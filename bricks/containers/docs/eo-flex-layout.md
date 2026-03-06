---
tagName: eo-flex-layout
displayName: WrappedEoFlexLayout
description: flex 布局容器
category: container-layout
source: "@next-bricks/containers"
---

# eo-flex-layout

> flex 布局容器

## Props

| 属性           | 类型                              | 必填 | 默认值 | 说明                                                                                                                     |
| -------------- | --------------------------------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| flexDirection  | `CSSProperties["flexDirection"]`  | 否   | -      | 定义 [flex-direction](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction)，控制主轴方向，如 `row`、`column` |
| justifyContent | `CSSProperties["justifyContent"]` | 否   | -      | 定义 [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content)，控制主轴上的对齐方式           |
| alignItems     | `CSSProperties["alignItems"]`     | 否   | -      | 定义 [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)，控制交叉轴上单行的对齐方式             |
| alignContent   | `CSSProperties["alignContent"]`   | 否   | -      | 定义 [align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)，控制多行在交叉轴上的对齐方式       |
| flexWrap       | `CSSProperties["flexWrap"]`       | 否   | -      | 定义 [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)，控制换行方式，如 `wrap`、`nowrap`          |
| gap            | `string`                          | 否   | -      | 定义 [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)，设置子元素之间的间距                                   |

## Slots

| 名称      | 说明                |
| --------- | ------------------- |
| (default) | flex 容器内的子元素 |

## Examples

### Justify Content

通过 `justifyContent` 控制子元素在主轴上的对齐方式。

```yaml preview
- brick: style
  properties:
    textContent: |
      .box {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-align: center;
        font-size: 24px;
      }
      .a {
        background: rgb(228, 119, 119);
      }
      .b {
        background: rgb(180, 242, 180);
      }
      .c {
        background: rgb(61, 145, 225);
      }
- brick: div
  properties:
    style:
      width: 100%
      height: 100%
      background: "#abc"
  slots:
    "":
      bricks:
        - brick: eo-flex-layout
          properties:
            justifyContent: start
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: Start
                    className: box a
        - brick: eo-flex-layout
          properties:
            justifyContent: center
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: Center
                    className: box b
        - brick: eo-flex-layout
          properties:
            justifyContent: end
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: End
                    className: box c
```

### Flex Direction

通过 `flexDirection` 切换主轴方向，实现横向或纵向排列。

```yaml preview
- brick: style
  properties:
    textContent: |
      .box {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-align: center;
        font-size: 24px;
      }
      .a {
        background: rgb(228, 119, 119);
      }
      .b {
        background: rgb(180, 242, 180);
      }
- brick: div
  properties:
    style:
      width: 100%
      height: 100%
      background: "#abc"
  slots:
    "":
      bricks:
        - brick: eo-flex-layout
          properties:
            flexDirection: row
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: a
                    className: box a
                - brick: div
                  properties:
                    textContent: b
                    className: box b
        - brick: div
          properties:
            style:
              height: 20px
        - brick: eo-flex-layout
          properties:
            flexDirection: column
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: a
                    className: box a
                - brick: div
                  properties:
                    textContent: b
                    className: box b
```

### Align Items & Wrap

通过 `alignItems` 控制交叉轴对齐，通过 `flexWrap` 允许子元素换行，`gap` 设置间距。

```yaml preview
- brick: style
  properties:
    textContent: |
      .box {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 18px;
        background: rgb(61, 145, 225);
      }
- brick: eo-flex-layout
  properties:
    flexWrap: wrap
    alignItems: center
    gap: 12px
    style:
      width: 300px
      background: "#eee"
      padding: 8px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: "1"
            className: box
        - brick: div
          properties:
            textContent: "2"
            className: box
        - brick: div
          properties:
            textContent: "3"
            className: box
        - brick: div
          properties:
            textContent: "4"
            className: box
        - brick: div
          properties:
            textContent: "5"
            className: box
```
