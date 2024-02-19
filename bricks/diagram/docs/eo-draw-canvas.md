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
```

### Legacy

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
      - brick: eo-shape
        properties:
          shape: rect
        events:
          drag.move:
            action: context.replace
            args:
              - dragging
              - <% EVENT.detail %>
          drag.end:
            - action: context.replace
              args:
                - dragging
                - null
            - target: eo-draw-canvas
              method: drop
              args:
                - position: <% EVENT.detail %>
                  data:
                    type: shape
                    shape: rect
              callback:
                success:
                  if: <% EVENT.detail %>
                  action: context.replace
                  args:
                    - nodes
                    - <% CTX.nodes.concat(EVENT.detail) %>
  - brick: eo-draw-canvas
    properties:
      style:
        flex: 1
        minWidth: 0
    children:
      - brick: :forEach
        dataSource: <%= CTX.nodes %>
        children:
          - brick: eo-shape
            properties:
              shape: <% ITEM.data.shape %>
              style:
                position: absolute
                left: <% ITEM.position[0] + 'px' %>
                top: <% ITEM.position[1] + 'px' %>
  - brick: eo-shape
    properties:
      dragging: true
      shape: rect
      style: |
        <%=
          {
            left: `${CTX.dragging?.[0]}px`,
            top: `${CTX.dragging?.[1]}px`,
          }
        %>
      hidden: <%= !CTX.dragging %>
```
