基于网格的简易布局容器。

## Examples

### GridAreas & GridTemplateRows

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

```yaml preview
- brick: style
  properties:
    containerStyle:
      height: 300px
    gridTemplateRows: "100px 100px"
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
