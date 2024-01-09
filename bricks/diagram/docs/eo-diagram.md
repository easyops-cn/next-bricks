构件 `eo-diagram`

## Examples

### Basic

```yaml preview minHeight="600px"
brick: div
properties:
  style:
    position: fixed
    height: 100vh
    width: 100vw
    top: 0px
    left: 0px
context:
  - name: activeNodeId
  - name: nodes
    value:
      - id: kspacey
        label: Kevin Spacey
      - id: swilliams
        label: Saul Williams
      - id: bpitt
        label: Brad Pitt
      # - id: hford
      #   label: Harrison Ford
      - id: lwilson
        label: Luke Wilson
      - id: kbacon
        label: Kevin Bacon
  - name: edges
    value:
      - source: kspacey
        target: swilliams
      - source: swilliams
        target: kbacon
      - source: bpitt
        target: kbacon
      # - source: hford
      #   target: lwilson
      - source: lwilson
        target: kbacon
children:
  - brick: eo-button
    properties:
      textContent: Add Harrison Ford
    events:
      click:
        - action: context.replace
          args:
            - nodes
            - |
              <%
                CTX.nodes.concat({
                  id: "hford",
                  label: "Harrison Ford",
                })
              %>
        - action: context.replace
          args:
            - edges
            - |
              <%
                CTX.edges.concat({
                  source: "hford",
                  target: "lwilson",
                })
              %>
        - target: _self
          properties:
            style:
              visibility: hidden
  - brick: eo-button
    properties:
      textContent: Remove Kevin Spacey
    events:
      click:
        - action: context.replace
          args:
            - nodes
            - |
              <%
                CTX.nodes.filter(node => node.id !== "kspacey")
              %>
        - action: context.replace
          args:
            - edges
            - |
              <%
                CTX.edges.filter(({ source, target }) => source !== "kspacey" && target !== "kspacey")
              %>
        - target: _self
          properties:
            style:
              visibility: hidden
  - brick: eo-diagram
    properties:
      layout: dagre
      nodes: <%= CTX.nodes %>
      edges: <%= CTX.edges %>
      lines:
        - arrow: true
      activeNodeId: <%= CTX.activeNodeId %>
      nodeBricks:
        - useBrick:
            # if: <% DATA.node.id !== "kbacon" %>
            brick: div
            properties:
              style: |
                <%=
                  {
                    width: "180px",
                    height: "100px",
                    border: "2px solid green",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: DATA.node.id === CTX.activeNodeId ? "2px solid orange" : "none",
                    outlineOffset: "2px",
                  }
                %>
            children:
              - brick: span
                properties:
                  textContent: <% DATA.node.label %>
            events:
              click:
                action: context.replace
                args:
                  - activeNodeId
                  - <% DATA.node.id %>
    events:
      activeNode.change:
        action: context.replace
        if: <% CTX.activeNodeId !== EVENT.detail.id %>
        args:
          - activeNodeId
          - <% EVENT.detail?.id %>
```

### Page Architecture

```yaml preview minHeight="600px"
brick: div
properties:
  style:
    position: fixed
    height: 100vh
    width: 100vw
    top: 0px
    left: 0px
context:
  - name: activeTarget
    value: null
  - name: tempNodeId
  - name: targetNode
  - name: editingLabelNodes
    value: []
  - name: editingLabelEdges
    value: []
  - name: nodes
    value:
      - type: board
        id: 60bf6078b095f
        name: Visual Builder
        depth: 0
        parentId:
        description: 某某产品
      - type: page
        id: 60bf60848d6d2
        name: 项目列表
        depth: 1
        parentId: 60bf6078b095f
        description: 列表页
      - type: page
        id: 60d533eba4ab2
        name: ccc
        depth: 1
        parentId: 60bf6078b095f
        description: cccc
      - type: link
        id: 60bf6091a1089
        name: 新建项目
        pageType: information:form:basic-form
        description: 新建页213
        to:
          "@":
            description: 无项目
            instanceId: 60c5fea301b32
          description: 新建页213
          instanceId: 60bf6091a1089
          module: []
          name: 新建项目
          pageType: information:form:basic-form
        depth: -1
        parentId:
      - type: link
        id: 60bf60a258613
        name: 项目首页-路由管理
        description: 路由管理
        to:
          description: 路由管理
          instanceId: 60bf60a258613
          module:
            - instanceId: 60bf609b26889
              name: Project
          name: 项目首页-路由管理
        depth: -1
        parentId:
      - type: link
        id: 60c5f39a2c2e1
        name: Launchpad 出厂配置
        description: Launchpad 出厂配置
        to:
          description: Launchpad 出厂配置
          instanceId: 60c5f39a2c2e1
          module: []
          name: Launchpad 出厂配置
        depth: -1
        parentId:
  - name: edges
    value:
      - type: menu
        source: 60bf6078b095f
        target: 60bf60848d6d2
      - type: menu
        source: 60bf6078b095f
        target: 60d533eba4ab2
      - type: link
        source: 60bf60848d6d2
        target: 60bf6091a1089
        description: 无项目
      - type: link
        source: 60bf60848d6d2
        target: 60bf60a258613
      - type: link
        source: 60bf60848d6d2
        target: 60c5f39a2c2e1
children:
  - brick: eo-diagram
    properties:
      layout: dagre
      nodes: <%= CTX.nodes %>
      edges: <%= CTX.edges %>
      lines:
        - edgeType: link
          strokeColor: var(--theme-blue-color)
          arrow: true
          interactable: true
          label:
            useBrick:
              brick: diagram.editable-label
              properties:
                label: <% DATA.edge.description %>
                type: line
              events:
                label.change:
                  if: <% (DATA.edge.description || "") !== (EVENT.detail || "") %>
                  action: context.replace
                  args:
                    - edges
                    - |-
                      <%
                        CTX.edges.map((edge) =>
                          edge.source === DATA.edge.source &&
                          edge.target === DATA.edge.target
                            ? { ...edge, description: EVENT.detail }
                            : edge
                        )
                      %>
                label.editing.change:
                  action: context.replace
                  args:
                    - editingLabelEdges
                    - |-
                      <%
                        EVENT.detail
                          ? CTX.editingLabelEdges.concat(
                              `${DATA.edge.source}-:-${DATA.edge.target}`
                            )
                          : CTX.editingLabelEdges.filter(
                              (id) =>
                                id !== `${DATA.edge.source}-:-${DATA.edge.target}`
                            )
                      %>
                click:
                  action: context.replace
                  args:
                    - activeTarget
                    - type: edge
                      edge: <% DATA.edge %>
        - edgeType: menu
          strokeColor: var(--palette-gray-5)
          arrow: true
          interactable: true
      layoutOptions:
        nodePadding: [4, 10, 10]
      activeTarget: <%= CTX.activeTarget %>
      disableKeyboardAction: <%= CTX.editingLabelNodes.length > 0 || CTX.editingLabelEdges.length > 0 %>
      nodesConnect:
        arrow: true
        strokeColor: |-
          <%
            DATA.source.type === "board"
              ? "var(--palette-gray-5)"
              : "var(--theme-blue-color)"
          %>
      nodeBricks:
        - useBrick:
            brick: visual-builder.page-arch-node
            properties:
              label: <% DATA.node.name %>
              type: <% DATA.node.type %>
              autoFocusOnce: |
                <% DATA.node.$temp ? DATA.node.id : undefined %>
              active: <%= CTX.activeTarget?.type === "node" && CTX.activeTarget.nodeId === DATA.node.id %>
            events:
              click:
                action: context.replace
                args:
                  - activeTarget
                  - type: node
                    nodeId: <% DATA.node.id %>
              label.editing.change:
                action: context.replace
                args:
                  - editingLabelNodes
                  - |
                    <%
                      EVENT.detail
                        ? CTX.editingLabelNodes.concat(DATA.node.id)
                        : CTX.editingLabelNodes.filter(
                            id => id !== DATA.node.id
                          )
                    %>
              label.change:
              - if: <% CTX.nodes.find(({id}) => id === DATA.node.id)?.$temp %>
                action: context.replace
                args:
                args:
                  - nodes
                  - |
                    <%
                      CTX.nodes.map((node) => (
                        node.id === DATA.node.id
                          ? { ...node, $temp: false, name: EVENT.detail }
                          : node
                      ))
                    %>
                # Take reaction only if the label has been changed
              - if: <% CTX.nodes.find(({id}) => id === DATA.node.id)?.name !== EVENT.detail %>
                action: context.replace
                args:
                  - nodes
                  - |
                    <%
                      CTX.nodes.map((node) => (
                        node.id === DATA.node.id
                          ? { ...node, name: EVENT.detail }
                          : node
                      ))
                    %>
              child.append:
                - action: context.replace
                  args:
                    - tempNodeId
                    - <% _.uniqueId('$temp-') %>
                - action: context.replace
                  args:
                    - nodes
                    - |
                      <% CTX.nodes.concat({ id: CTX.tempNodeId, name: "未命名", $temp: true }) %>
                - action: context.replace
                  args:
                    - edges
                    - |
                      <% CTX.edges.concat({ source: DATA.node.id, target: CTX.tempNodeId, name: "未命名", type: "link", $temp: true }) %>
                - action: context.replace
                  args:
                    - activeTarget
                    - type: node
                      nodeId: <% CTX.tempNodeId %>
    events:
      activeTarget.change:
        - action: context.replace
          # Take reaction only if the active node has been changed
          # Otherwise it may cause infinite loop
          if: |
            <%
              ((newTarget, previousTarget) =>
                (newTarget
                  ? !previousTarget ||
                    newTarget.type !== previousTarget.type ||
                    (newTarget.type === "node"
                      ? newTarget.nodeId !== previousTarget.nodeId
                      : newTarget.edge.source !== previousTarget.edge.source ||
                        newTarget.edge.target !== previousTarget.edge.target)
                : !!previousTarget)
              )(EVENT.detail, CTX.activeTarget)
            %>
          args:
            - activeTarget
            - <% EVENT.detail %>
      node.delete:
        - action: context.replace
          args:
            - targetNode
            - <% EVENT.detail %>
        - useProvider: basic.show-dialog
          args:
          - type: delete
            title: Delete Confirm
            content: Please enter {{ expect }} to delete the node.
            expect: <% EVENT.detail.name || "未命名" %>
          callback:
            success:
            - action: context.replace
              args:
                - nodes
                - |-
                  <%
                    CTX.nodes.filter(
                      ({ id }) => id !== CTX.targetNode.id
                    )
                  %>
            - action: context.replace
              args:
                - edges
                - |-
                  <%
                    CTX.edges.filter(
                      ({ source, target }) =>
                        source !== CTX.targetNode.id &&
                        target !== CTX.targetNode.id
                    )
                  %>
      edge.delete:
        action: context.replace
        args:
          - edges
          - |-
            <%
              CTX.edges.filter(
                ({ source, target }) =>
                  source !== EVENT.detail.source ||
                  target !== EVENT.detail.target
              )
            %>
      line.click:
        action: context.replace
        args:
          - activeTarget
          - type: edge
            edge: <% EVENT.detail.edge %>
      line.dblclick:
        target: _self
        method: callOnLineLabel
        args:
          - <% EVENT.detail.id %>
          - enableEditing
      nodes.connect:
        if: |-
          <%
            EVENT.detail.target.type !== "board" &&
            !CTX.edges.some(
              (edge) =>
                edge.source === EVENT.detail.source.id &&
                edge.target === EVENT.detail.target.id
            )
          %>
        action: context.replace
        args:
          - edges
          - |-
            <%
              CTX.edges.concat({
                source: EVENT.detail.source.id,
                target: EVENT.detail.target.id,
                type:
                  EVENT.detail.source.type === "board"
                    ? "menu"
                    : "link",
              })
            %>
```
