用于手工绘图的画布。

注意：将配套另外一个用于展示的画布构件。

## Examples

### Basic

```yaml preview minHeight="600px"
brick: div
properties:
  style:
    display: flex
    height: 600px
    gap: 1em
context:
  - name: dragging
    value: null
children:
  - brick: div
    properties:
      style:
        width: 180px
        display: flex
        flexDirection: column
        gap: 1em
    children:
      - brick: eo-button
        properties:
          textContent: Add random nodes
        events:
          click:
            target: eo-draw-canvas
            method: addNodes
            args:
              - |
                <%
                  ((...seeds) => seeds.map((seed) => ({
                    id: seed,
                    data: {
                      name: String(seed),
                    },
                    useBrick: {
                      brick: "diagram.experimental-node",
                      properties: {
                        textContent: String(seed),
                      }
                    },
                    size: [60, 60],
                  })))(
                    Math.round(Math.random() * 1e6),
                    Math.round(Math.random() * 1e6),
                    Math.round(Math.random() * 1e6),
                  )
                %>
            callback:
              success:
                action: console.log
                args:
                  - Added nodes
                  - <% EVENT.detail %>
      - brick: eo-button
        properties:
          textContent: "Add edge: Y => Z"
        events:
          click:
            target: eo-draw-canvas
            method: addEdge
            args:
              - source: Y
                target: Z
      - brick: hr
        properties:
          style:
            width: 100%
      - brick: h3
        properties:
          textContent: Drag nodes below
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
          cells: |
            <%
              [
                {
                  type: "edge",
                  source: "X",
                  target: "Y",
                },
                {
                  type: "edge",
                  source: "X",
                  target: "Z",
                },
              ].concat(
                ["X", "Y", "Z"].map((id) => ({
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
                  view: {
                    x:
                      id === "X"
                        ? 200 + Math.random() * 200
                        : id === "Y"
                        ? Math.random() * 300
                        : 300 + Math.random() * 300,
                    y: (id === "X" ? 0 : 300) + Math.random() * 200,
                    width: 60,
                    height: 60,
                  }
                }))
              )
            %>
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
