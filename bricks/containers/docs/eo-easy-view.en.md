---
tagName: eo-easy-view
displayName: WrappedEoEasyView
description: A simple grid-based layout container
category: container-layout
source: "@next-bricks/containers"
---

# eo-easy-view

> A simple grid-based layout container

## Props

| property            | type                                  | required    | default | description |
| ------------------- | ------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| gridAreas           | `Record<string, (string               | number)[]>` | no     | -      | Defines multiple [grid-area](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area) entries as key-value pairs, where the key is the area name and the value is a `[row-start, col-start, row-end, col-end]` array |
| gridTemplateAreas   | `string[][]`                          | no          | -      | Defines [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas) as a two-dimensional array, where each sub-array represents a row and `.` represents an empty cell |
| gridTemplateColumns | `string \| string[]`                  | no          | -      | Defines [grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns); accepts a string or an array of strings (automatically joined with spaces) |
| gridTemplateRows    | `string \| string[]`                  | no          | -      | Defines [grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows); accepts a string or an array of strings |
| containerStyle      | `React.CSSProperties`                 | no          | -      | Defines the style of the grid container |
| styleByAreas        | `Record<string, React.CSSProperties>` | no          | -      | Defines the style of each area in the grid, where the key is the area name |

## Examples

### GridAreas & GridTemplateRows

Use `gridAreas` to precisely specify the start and end row/column positions of each area as key-value pairs.

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

Use the `gridTemplateAreas` two-dimensional array to describe the area layout, where `.` represents an empty cell.

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

Use `containerStyle` to customize the overall style of the grid container and `styleByAreas` to customize the style of each area.

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
