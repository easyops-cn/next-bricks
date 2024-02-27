构件 `eo-draw-canvas`

## Examples

### Basic

```yaml preview minHeight="600px"
brick: eo-draw-canvas
properties:
  cells:
    - tag: shape
      shape: rectangle
      x: 10
      y: 20
      width: 180
      height: 120
    - tag: shape
      shape: rectangle
      x: 240
      y: 20
      width: 180
      height: 120
    - tag: brick
      useBrick:
        brick: eo-button
        properties:
          textContent: Click Me
      x: 500
      y: 20
      width: 180
      height: 120
```

### Drag and drop

```yaml preview minHeight="600px"
brick: div
properties:
  style:
    display: flex
    height: 600px
context:
  - name: dragging
    value: null
  - name: nodes
    value: []
children:
  - brick: div
    properties:
      style:
        width: 200px
    children:
      - brick: :forEach
        dataSource:
          - A
          - B
        children:
          - brick: diagram.experimental-node
            properties:
              textContent: <% `Node ${ITEM}` %>
            events:
              drag.move:
                action: context.replace
                args:
                  - dragging
                  - |
                    <% {position: EVENT.detail, data: ITEM} %>
              drag.end:
                - action: context.replace
                  args:
                    - dragging
                    - null
                - target: eo-draw-canvas
                  method: drop
                  args:
                    - position: <% EVENT.detail %>
                      data: <% ITEM %>
                  callback:
                    success:
                      if: <% EVENT.detail %>
                      then:
                        action: message.success
                        args:
                          - <% JSON.stringify(EVENT.detail) %>
                      else:
                        action: message.warn
                        args:
                          - Unexpected drop
  - brick: eo-draw-canvas
    properties:
      style:
        flex: 1
        minWidth: 0
      cells: []
  - brick: diagram.experimental-node
    properties:
      dragging: true
      textContent: <%= CTX.dragging?.data %>
      style: |
        <%=
          {
            left: `${CTX.dragging?.position.[0]}px`,
            top: `${CTX.dragging?.position.[0]}px`,
          }
        %>
      hidden: <%= !CTX.dragging %>
```
