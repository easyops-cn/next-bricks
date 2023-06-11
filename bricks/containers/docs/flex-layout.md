flex 布局容器。

## Example

### Justify Content

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
        - brick: containers.flex-layout
          properties:
            justifyContent: start
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: Start
                    className: box a
        - brick: containers.flex-layout
          properties:
            justifyContent: center
          slots:
            "":
              bricks:
                - brick: div
                  properties:
                    textContent: Center
                    className: box b
        - brick: containers.flex-layout
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
        - brick: containers.flex-layout
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
        - brick: containers.flex-layout
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
