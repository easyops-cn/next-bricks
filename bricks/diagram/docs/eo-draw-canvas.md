构件 `eo-draw-canvas`

## Examples

### Basic

```yaml preview minHeight="600px"
brick: div
properties:
  style:
    display: flex
    height: 600px
context:
  - name: dragging
    value: null
children:
  - brick: div
    properties:
      style:
        width: 200px
    children:
      - brick: :forEach
        dataSource: |
          <%
            ["A", "B", "C"].map((id) => ({
              type: "node",
              id,
              data: {
                name: `Node ${id}`,
              },
              useBrick: {
                brick: "diagram.experimental-node",
                properties: {
                  textContent: `Node ${id}`,
                }
              },
            }))
          %>
        children:
          - brick: diagram.experimental-node
            properties:
              textContent: <% ITEM.data.name %>
              usage: library
            events:
              drag.move:
                action: context.replace
                args:
                  - dragging
                  - |
                    <% {position: EVENT.detail, ...ITEM} %>
              drag.end:
                - action: context.replace
                  args:
                    - dragging
                    - null
                - target: eo-draw-canvas
                  method: dropNode
                  args:
                    - position: <% EVENT.detail %>
                      size: [60, 60]
                      id: <% ITEM.id %>
                      data: <% ITEM.data %>
                      useBrick: <% ITEM.useBrick %>
                  callback:
                    success:
                      if: <% EVENT.detail %>
                      then:
                        # action: message.success
                        # args:
                        #   - <% JSON.stringify(EVENT.detail) %>
                      else:
                        action: message.warn
                        args:
                          - Unexpected drop position
  - brick: div
    properties:
      style:
        flex: 1
        minWidth: 0
    children:
      - brick: eo-draw-canvas
        properties:
          style:
            width: 100%
            height: 100%
          # Initial nodes only
          cells:
            - type: node
              id: x
              data:
                name: Node X
              view:
                x: 300
                y: 200
                width: 60
                height: 60
              useBrick:
                brick: diagram.experimental-node
                properties:
                  textContent: Node X
  - brick: diagram.experimental-node
    properties:
      usage: dragging
      textContent: <%= CTX.dragging?.data.name %>
      style: |
        <%=
          {
            left: `${CTX.dragging?.position[0]}px`,
            top: `${CTX.dragging?.position[1]}px`,
          }
        %>
      hidden: <%= !CTX.dragging %>
```
