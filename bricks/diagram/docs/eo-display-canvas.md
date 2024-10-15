用于展示查看的画布构件。

## Examples

### Basic

```yaml preview minHeight="600px"
- brick: div
  properties:
    style:
      display: flex
      height: 600px
      gap: 1em
  context:
    - name: initialCells
      value: |
        <%
          [
            {
              type: "decorator",
              id: "area-1",
              decorator: "area",
              view: {
                x: 10,
                y: 20,
                width: 400,
                height: 300,
              },
            },
            {
              type: "decorator",
              id: "container-1",
              decorator: "container",
              view: {
               x: 50,
                y: 400,
                width: 280,
                height: 120,
                direction: "top",
                text: " 上层服务"
              },
            },
            {
              type: "edge",
              source: "X",
              target: "Y",
              data: {
                virtual: false,
                showStartArrow: false,
                strokeColor:"red",
                strokeWidth: 5,
              }
            },
            {
              type: "edge",
              source: "X",
              target: "W",
              data: {
                virtual: false,
                showStartArrow: true,
                strokeColor:"pink",
                animate:{
                  useAnimate: true,
                  duration: 4
                }
              }
            },
            {
              type: "edge",
              source: "X",
              target: "Z",
              data: {
                virtual: true,
                showStartArrow: true,
                strokeColor:"blue",
                animate:{
                  useAnimate: true
                }
              }
            },
            {
              type: "edge",
              source: "W",
              target: "Z",
              view: {
                entryPosition: { x: 0, y: 0.5 },
                exitPosition: {x: 0.5, y: 0}
              }
            }
          ].concat(
            ["X", "Y", "Z", "W"].map((id) => ({
              type: "node",
              id,
              containerId: ["X","Y","Z"].includes(id)?"container-1":undefined,
              data: {
                name: `Node ${id}`,
              },
              view: {
                x: Math.round(
                  id === "X"
                    ? 200 + Math.random() * 200
                    : id === "Y"
                    ? Math.random() * 300
                    : 300 + Math.random() * 300
                ),
                y: (id === "X" ? 0 : 300) + Math.round((Math.random() * 200)),
                width: 60,
                height: 60,
              }
            }))
          ).concat([
            {
              type: "decorator",
              id: "text-1",
              decorator: "text",
              view: {
                x: 100,
                y: 120,
                width: 100,
                height: 20,
                text: "Hello!"
              },
            },
          ])
        %>
    - name: activeTarget
    - name: targetCell
  children:
    - brick: div
      properties:
        style:
          flex: 1
          minWidth: 0
      children:
        - brick: eo-display-canvas
          properties:
            style:
              width: 100%
              height: 100%
            activeTarget: <%= CTX.activeTarget %>
            fadeUnrelatedCells: true
            # Initial nodes only
            defaultNodeSize: [60, 60]
            defaultNodeBricks:
              - useBrick:
                  brick: diagram.experimental-node
                  properties:
                    textContent: <% `Node ${DATA.node.id}` %>
                    status: |
                      <%=
                        CTX.activeTarget?.type === "node" && CTX.activeTarget.id === DATA.node.id
                          ? "highlighted"
                          // : CTX.unrelated.some(n =>
                          //     n.type === "node" && n.id === DATA.node.id
                          //   )
                          // ? "faded"
                          : "default"
                      %>
            defaultEdgeLines:
              - if: true
                dashed: <% DATA.edge?.data?.virtual %>
                strokeColor: <% DATA.edge?.data?.strokeColor %>
                showStartArrow: <% DATA.edge?.data?.showStartArrow %>
                strokeWidth: <% DATA.edge?.data?.strokeWidth %>
                animate: <% DATA.edge?.data?.animate %>
                showStartArrow: true
                markers:
                  - placement: end
                    type: circle
                  - placement: start
                    type: arrow
            cells: <% CTX.initialCells %>
          events:
            activeTarget.change:
              action: context.replace
              args:
                - activeTarget
                - <% EVENT.detail %>
            cell.contextmenu:
              - target: eo-context-menu
                method: open
                args:
                  - position:
                      - <% EVENT.detail.clientX %>
                      - <% EVENT.detail.clientY %>
              - action: context.replace
                args:
                  - targetCell
                  - <% EVENT.detail.cell %>
            scale.change:
              action: context.replace
              args:
                - scale
                - <% EVENT.detail %>
- brick: eo-context-menu
  properties:
    actions: |
      <%=
        [
          {
            text: `Test ${CTX.targetCell?.type}`,
            event: `test-${CTX.targetCell?.type}`,
          }
        ]
      %>
```

### Force layout

```yaml preview minHeight="600px"
- brick: div
  properties:
    style:
      display: flex
      height: 600px
      gap: 1em
  context:
    - name: initialCells
      value: |
        <%
          [
            {
              type: "decorator",
              id: "area-1",
              decorator: "area",
              view: {
                x: 10,
                y: 20,
                width: 400,
                height: 300,
              },
            },
            {
              type: "edge",
              source: "X",
              target: "Y",
            },
            {
              type: "edge",
              source: "X",
              target: "Z",
              data: {
                virtual: true,
              }
            },
          ].concat(
            ["X", "Y", "Z", "W"].map((id) => ({
              type: "node",
              id,
              data: {
                name: `Node ${id}`,
              },
              view: {
                width: 60,
                height: 60,
              }
            }))
          ).concat([
            {
              type: "decorator",
              id: "text-1",
              decorator: "text",
              view: {
                x: 100,
                y: 120,
                width: 100,
                height: 20,
                text: "Hello!"
              },
            },
          ])
        %>
    - name: activeTarget
    - name: targetCell
  children:
    - brick: div
      properties:
        style:
          flex: 1
          minWidth: 0
      children:
        - brick: eo-display-canvas
          properties:
            style:
              width: 100%
              height: 100%
            activeTarget: <%= CTX.activeTarget %>
            fadeUnrelatedCells: true
            layout: force
            # Initial nodes only
            defaultNodeSize: [60, 60]
            defaultNodeBricks:
              - useBrick:
                  brick: diagram.experimental-node
                  properties:
                    textContent: <% `Node ${DATA.node.id}` %>
                    status: |
                      <%=
                        CTX.activeTarget?.type === "node" && CTX.activeTarget.id === DATA.node.id
                          ? "highlighted"
                          // : CTX.unrelated.some(n =>
                          //     n.type === "node" && n.id === DATA.node.id
                          //   )
                          // ? "faded"
                          : "default"
                      %>
            defaultEdgeLines:
              - if: <% DATA.edge.data?.virtual %>
                dashed: true
            cells: <% CTX.initialCells %>
          events:
            activeTarget.change:
              action: context.replace
              args:
                - activeTarget
                - <% EVENT.detail %>
            cell.contextmenu:
              - target: eo-context-menu
                method: open
                args:
                  - position:
                      - <% EVENT.detail.clientX %>
                      - <% EVENT.detail.clientY %>
              - action: context.replace
                args:
                  - targetCell
                  - <% EVENT.detail.cell %>
            scale.change:
              action: context.replace
              args:
                - scale
                - <% EVENT.detail %>
- brick: eo-context-menu
  properties:
    actions: |
      <%=
        [
          {
            text: `Test ${CTX.targetCell?.type}`,
            event: `test-${CTX.targetCell?.type}`,
          }
        ]
      %>
```

### Dagre layout

```yaml preview minHeight="600px"
- brick: div
  properties:
    style:
      display: flex
      height: 600px
      gap: 1em
  context:
    - name: initialCells
      value: |
        <%
          [
            {
              type: "decorator",
              id: "area-1",
              decorator: "area",
              view: {
                x: 10,
                y: 20,
                width: 400,
                height: 300,
              },
            },
            {
              type: "edge",
              source: "X",
              target: "Y",
            },
            {
              type: "edge",
              source: "X",
              target: "Z",
              data: {
                virtual: true,
              }
            },
          ].concat(
            ["X", "Y", "Z", "W"].map((id) => ({
              type: "node",
              id,
              data: {
                name: `Node ${id}`,
              },
              view: {
                width: 60,
                height: 60,
              }
            }))
          ).concat([
            {
              type: "decorator",
              id: "text-1",
              decorator: "text",
              view: {
                x: 100,
                y: 120,
                width: 100,
                height: 20,
                text: "Hello!"
              },
            },
          ])
        %>
    - name: activeTarget
    - name: targetCell
  children:
    - brick: div
      properties:
        style:
          flex: 1
          minWidth: 0
      children:
        - brick: eo-display-canvas
          properties:
            style:
              width: 100%
              height: 100%
            activeTarget: <%= CTX.activeTarget %>
            fadeUnrelatedCells: true
            layout: dagre
            # Initial nodes only
            defaultNodeSize: [60, 60]
            defaultNodeBricks:
              - useBrick:
                  brick: diagram.experimental-node
                  properties:
                    textContent: <% `Node ${DATA.node.id}` %>
                    status: |
                      <%=
                        CTX.activeTarget?.type === "node" && CTX.activeTarget.id === DATA.node.id
                          ? "highlighted"
                          // : CTX.unrelated.some(n =>
                          //     n.type === "node" && n.id === DATA.node.id
                          //   )
                          // ? "faded"
                          : "default"
                      %>
            defaultEdgeLines:
              - if: <% DATA.edge.data?.virtual %>
                dashed: true
            cells: <% CTX.initialCells %>
          events:
            activeTarget.change:
              action: context.replace
              args:
                - activeTarget
                - <% EVENT.detail %>
            cell.contextmenu:
              - target: eo-context-menu
                method: open
                args:
                  - position:
                      - <% EVENT.detail.clientX %>
                      - <% EVENT.detail.clientY %>
              - action: context.replace
                args:
                  - targetCell
                  - <% EVENT.detail.cell %>
            scale.change:
              action: context.replace
              args:
                - scale
                - <% EVENT.detail %>
- brick: eo-context-menu
  properties:
    actions: |
      <%=
        [
          {
            text: `Test ${CTX.targetCell?.type}`,
            event: `test-${CTX.targetCell?.type}`,
          }
        ]
      %>
```

### Degraded diagram

```yaml preview minHeight="600px"
- brick: div
  properties:
    style:
      display: flex
      height: 600px
      gap: 1em
  context:
    - name: initialCells
      value: |
        <%
          ((...seeds) => seeds.map((seed) => ({
            type: "node",
            id: seed,
            data: {
              name: seed,
            },
          })))(
            ...(
              new Array(500).fill(null).map((_, i) => String(i))
            )
          )
        %>
    - name: activeTarget
    - name: targetCell
  children:
    - brick: div
      properties:
        style:
          flex: 1
          minWidth: 0
      children:
        - brick: eo-display-canvas
          properties:
            style:
              width: 100%
              height: 100%
            activeTarget: <%= CTX.activeTarget %>
            fadeUnrelatedCells: true
            layout: force
            # Initial nodes only
            defaultNodeSize: [60, 60]
            defaultNodeBricks:
              - useBrick:
                  brick: diagram.experimental-node
                  properties:
                    textContent: <% `Node ${DATA.node.id}` %>
                    status: |
                      <%=
                        CTX.activeTarget?.type === "node" && CTX.activeTarget.id === DATA.node.id
                          ? "highlighted"
                          // : CTX.unrelated.some(n =>
                          //     n.type === "node" && n.id === DATA.node.id
                          //   )
                          // ? "faded"
                          : "default"
                      %>
            defaultEdgeLines:
              - if: true
                dashed: <% DATA.edge?.data?.virtual %>
                strokeColor: <% DATA.edge?.data?.strokeColor %>
                showStartArrow: <% DATA.edge?.data?.showStartArrow %>
                strokeWidth: <% DATA.edge?.data?.strokeWidth %>
                animate: <% DATA.edge?.data?.animate %>
            cells: <% CTX.initialCells %>
          events:
            activeTarget.change:
              action: context.replace
              args:
                - activeTarget
                - <% EVENT.detail %>
            cell.contextmenu:
              - target: eo-context-menu
                method: open
                args:
                  - position:
                      - <% EVENT.detail.clientX %>
                      - <% EVENT.detail.clientY %>
              - action: context.replace
                args:
                  - targetCell
                  - <% EVENT.detail.cell %>
            scale.change:
              action: context.replace
              args:
                - scale
                - <% EVENT.detail %>
- brick: eo-context-menu
  properties:
    actions: |
      <%=
        [
          {
            text: `Test ${CTX.targetCell?.type}`,
            event: `test-${CTX.targetCell?.type}`,
          }
        ]
      %>
```
