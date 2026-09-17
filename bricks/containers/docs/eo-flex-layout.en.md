---
tagName: eo-flex-layout
displayName: WrappedEoFlexLayout
description: Flex layout container
category: container-layout
source: "@next-bricks/containers"
---

# eo-flex-layout

> Flex layout container

## Props

| property       | type                              | required | default | description                                                                                                                                                     |
| -------------- | --------------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| flexDirection  | `CSSProperties["flexDirection"]`  | no       | -       | Defines [flex-direction](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction), controlling the main axis direction, such as `row`, `column`         |
| justifyContent | `CSSProperties["justifyContent"]` | no       | -       | Defines [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content), controlling the alignment along the main axis                      |
| alignItems     | `CSSProperties["alignItems"]`     | no       | -       | Defines [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items), controlling the alignment of a single line along the cross axis            |
| alignContent   | `CSSProperties["alignContent"]`   | no       | -       | Defines [align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content), controlling the alignment of multiple lines along the cross axis       |
| flexWrap       | `CSSProperties["flexWrap"]`       | no       | -       | Defines [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap), controlling the wrapping mode, such as `wrap`, `nowrap`                         |
| gap            | `string`                          | no       | -       | Defines [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap), setting the spacing between child elements                                                 |

## Slots

| name      | description                           |
| --------- | ------------------------------------- |
| (default) | Child elements inside the flex container |

## Examples

### Justify Content

Control the alignment of child elements along the main axis with `justifyContent`.

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

Switch the main axis direction with `flexDirection` to lay out children horizontally or vertically.

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

Control cross-axis alignment with `alignItems`, allow child elements to wrap with `flexWrap`, and set the spacing with `gap`.

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
