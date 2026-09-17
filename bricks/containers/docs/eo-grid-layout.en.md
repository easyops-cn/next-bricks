---
tagName: eo-grid-layout
displayName: WrappedEoGridLayout
description: A responsive grid layout with multiple rows and columns
category: container-layout
source: "@next-bricks/containers"
---

# eo-grid-layout

> A responsive grid layout with multiple rows and columns

## Props

| property        | type                              | required | default                  | description                                                                                  |
| --------------- | --------------------------------- | -------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| columns         | `number`                          | no       | -                        | Number of grid columns (all columns are equal in width); a single column when not set        |
| rows            | `number`                          | no       | `1`                      | Number of grid rows                                                                          |
| rowSpan         | `number`                          | no       | `1`                      | Number of rows occupied in the parent grid                                                   |
| columnSpan      | `number`                          | no       | `1`                      | Number of columns occupied in the parent grid                                                |
| templateColumns | `string`                          | no       | -                        | Grid template columns; takes precedence over `columns`, e.g. `"repeat(3, 1fr) 2fr"`          |
| alignItems      | `CSSProperties["alignItems"]`     | no       | -                        | Sets the vertical position of cells                                                          |
| alignContent    | `CSSProperties["alignContent"]`   | no       | -                        | Sets the vertical position of the whole content area                                         |
| justifyItems    | `CSSProperties["justifyItems"]`   | no       | -                        | Sets the horizontal position of cell content                                                 |
| justifyContent  | `CSSProperties["justifyContent"]` | no       | -                        | Sets the horizontal position of the whole content area inside the container                  |
| autoFlow        | `CSSProperties["gridAutoFlow"]`   | no       | -                        | Automatic placement order of child elements, e.g. `row`, `column`, `row dense`               |
| responsive      | `ResponsiveSettings`              | no       | -                        | Responsive layout settings; automatically switches the grid configuration by viewport width  |
| gap             | `string`                          | no       | `"var(--page-card-gap)"` | Gap between child elements                                                                   |
| showGridBorder  | `boolean`                         | no       | `false`                  | Whether to show the grid layout border                                                       |
| gridBorderColor | `string`                          | no       | -                        | Grid layout border color; takes effect when `showGridBorder` is true, defaults to `#454547`  |

## Slots

| name      | description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| (default) | Child elements inside the grid layout; each direct child occupies one grid cell    |

## Examples

### Basic Columns

Use `columns` to set the number of equal-width columns and `gap` to control the spacing.

```yaml preview
- brick: eo-grid-layout
  properties:
    columns: 2
    gap: 20px
    style:
      width: 900px
      background: pink
      margin-bottom: 20px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: First div
            style:
              background: yellow
        - brick: div
          properties:
            textContent: Second div
            style:
              background: orange
        - brick: div
          properties:
            textContent: Third div
            style:
              background: blue
        - brick: div
          properties:
            textContent: Fourth div
            style:
              background: red
```

### Grid Border

Use `showGridBorder` to show the grid border and `gridBorderColor` to customize the border color.

```yaml preview
- brick: eo-grid-layout
  properties:
    columns: 3
    gap: 20px
    showGridBorder: true
    gridBorderColor: "#1890ff"
    style:
      width: 900px
      margin-bottom: 20px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: First div
            style:
              background: yellow
              padding: 8px
        - brick: div
          properties:
            textContent: Second div
            style:
              background: orange
              padding: 8px
        - brick: div
          properties:
            textContent: Third div
            style:
              background: blue
              padding: 8px
        - brick: div
          properties:
            textContent: Fourth div
            style:
              background: red
              padding: 8px
```

### Template Columns

Use `templateColumns` to customize the width of each column; more flexible than equal-width `columns`.

```yaml preview
- brick: eo-grid-layout
  properties:
    templateColumns: "200px 1fr 2fr"
    gap: 16px
    style:
      width: 900px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Fixed 200px
            style:
              background: rgb(228, 119, 119)
              padding: 8px
              color: "#fff"
        - brick: div
          properties:
            textContent: 1fr
            style:
              background: rgb(61, 145, 225)
              padding: 8px
              color: "#fff"
        - brick: div
          properties:
            textContent: 2fr
            style:
              background: rgb(180, 242, 180)
              padding: 8px
```

### Responsive Layout

Use `responsive` to configure automatic column switching at different viewport widths.

```yaml preview
- brick: eo-grid-layout
  properties:
    columns: 4
    gap: 16px
    responsive:
      small:
        columns: 2
      xs:
        columns: 1
    style:
      width: 100%
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Item 1
            style:
              background: rgb(228, 119, 119)
              padding: 16px
              color: "#fff"
        - brick: div
          properties:
            textContent: Item 2
            style:
              background: rgb(61, 145, 225)
              padding: 16px
              color: "#fff"
        - brick: div
          properties:
            textContent: Item 3
            style:
              background: rgb(180, 242, 180)
              padding: 16px
        - brick: div
          properties:
            textContent: Item 4
            style:
              background: rgb(238, 238, 78)
              padding: 16px
```

### Alignment & AutoFlow

Use `alignItems` and `justifyItems` to control cell content alignment, and `autoFlow` to control the automatic placement order.

```yaml preview
- brick: eo-grid-layout
  properties:
    columns: 3
    gap: 16px
    alignItems: center
    justifyItems: center
    autoFlow: row dense
    style:
      width: 900px
      height: 200px
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: A
            style:
              background: rgb(228, 119, 119)
              padding: 8px
              color: "#fff"
        - brick: div
          properties:
            textContent: B
            style:
              background: rgb(61, 145, 225)
              padding: 16px
              color: "#fff"
        - brick: div
          properties:
            textContent: C
            style:
              background: rgb(180, 242, 180)
              padding: 24px
```

### Nested Grid (rowSpan & columnSpan)

Nest `eo-grid-layout` inside itself; a child grid spans multiple cells of the parent grid via `columnSpan` and `rowSpan`.

```yaml preview
- brick: eo-grid-layout
  properties:
    columns: 3
    rows: 2
    gap: 12px
    style:
      width: 900px
  slots:
    "":
      bricks:
        - brick: eo-grid-layout
          properties:
            columnSpan: 2
            style:
              background: rgb(228, 119, 119)
              padding: 8px
              color: "#fff"
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: Spans 2 columns
        - brick: div
          properties:
            textContent: Single column
            style:
              background: rgb(61, 145, 225)
              padding: 8px
              color: "#fff"
        - brick: div
          properties:
            textContent: Item 3
            style:
              background: rgb(180, 242, 180)
              padding: 8px
        - brick: div
          properties:
            textContent: Item 4
            style:
              background: rgb(238, 238, 78)
              padding: 8px
```
