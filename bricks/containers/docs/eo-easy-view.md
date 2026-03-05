---
tagName: eo-easy-view
displayName: WrappedEoEasyView
description: 基于网格的简易布局容器
category: container-layout
source: "@next-bricks/containers"
---

# eo-easy-view

> 基于网格的简易布局容器

## Props

| 属性                | 类型                                  | 必填        | 默认值 | 说明                                                                                                                                                 |
| ------------------- | ------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gridAreas           | `Record<string, (string               | number)[]>` | 否     | -                                                                                                                                                    | 以键值对形式定义多个 [grid-area](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)，键为区域名称，值为 `[row-start, col-start, row-end, col-end]` 数组 |
| gridTemplateAreas   | `string[][]`                          | 否          | -      | 定义 [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)，二维数组，每个子数组代表一行，`.` 表示空白格       |
| gridTemplateColumns | `string \| string[]`                  | 否          | -      | 定义 [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)，可传字符串或字符串数组（自动 join 为空格分隔） |
| gridTemplateRows    | `string \| string[]`                  | 否          | -      | 定义 [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows)，可传字符串或字符串数组                               |
| containerStyle      | `React.CSSProperties`                 | 否          | -      | 定义网格容器的样式                                                                                                                                   |
| styleByAreas        | `Record<string, React.CSSProperties>` | 否          | -      | 定义网格内各区域的样式，键为区域名称                                                                                                                 |

## Examples

### GridAreas & GridTemplateRows

通过 `gridAreas` 以键值对方式精确指定每个区域的起止行列位置。

```yaml preview
- brick: style
  properties:
    textContent: |
      .box {
        width: 100%;
        height: 100%;
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
- brick: eo-easy-view
  properties:
    gridTemplateRows: "100px 200px"
    gridTemplateColumns: "repeat(12, 1fr)"
    gridAreas:
      a:
        - 1
        - 1
        - 2
        - 13
      b:
        - 2
        - 1
        - 3
        - 5
      c:
        - 2
        - 5
        - 3
        - 13
  slots:
    a:
      bricks:
        - brick: div
          properties:
            textContent: A
            className: box a
    b:
      bricks:
        - brick: div
          properties:
            textContent: B
            className: box b
    c:
      bricks:
        - brick: div
          properties:
            textContent: C
            className: box c
```

### Grid Template Areas

通过 `gridTemplateAreas` 二维数组描述区域布局，`.` 表示空白格。

```yaml preview
- brick: style
  properties:
    textContent: |
      .box {
        width: 100%;
        height: 100%;
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
      .d {
        background: rgb(238, 238, 78);
      }
- brick: eo-easy-view
  properties:
    gridTemplateAreas: |
      <%
        [
          ["a", "a", "a"],
          ["b", ".", "d"],
          ["b", "c", "d"],
        ]
      %>
  slots:
    a:
      bricks:
        - brick: div
          properties:
            textContent: A
            className: box a
    b:
      bricks:
        - brick: div
          properties:
            textContent: B
            className: box b
    c:
      bricks:
        - brick: div
          properties:
            textContent: C
            className: box c
    d:
      bricks:
        - brick: div
          properties:
            textContent: D
            className: box d
```

### Container Style

使用 `containerStyle` 自定义网格容器整体样式，`styleByAreas` 自定义各区域样式。

```yaml preview
- brick: style
  properties:
    textContent: |
      .box {
        width: 100%;
        height: 100%;
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
- brick: eo-easy-view
  properties:
    containerStyle:
      marginTop: 30px
      height: 200px
    gridAreas: |
      <%
        {
          a: [1, 1, 4, 4],
          b: [1, 4, 3, 13],
          c: [3, 4, 3, 13],
        }
      %>
    styleByAreas:
      a:
        border: 2px solid #fff
  slots:
    a:
      bricks:
        - brick: div
          properties:
            textContent: A
            className: box a
    b:
      bricks:
        - brick: div
          properties:
            textContent: B
            className: box b
    c:
      bricks:
        - brick: div
          properties:
            textContent: C
            className: box c
```
