构件 `visual-builder.raw-data-preview`

## Examples

### Basic

```yaml preview
- brick: eo-tab-list
  properties:
    tabs: <% CTX.tabs %>
    activePanel: <% CTX.modelId %>
  events:
    tab.select:
      action: context.replace
      args:
        - modelId
        - <% EVENT.detail %>
  context:
    - name: modelId
      value: HOST
    - name: tabs
      value:
        - text: 主机
          panel: HOST
        - text: 应用
          panel: APP
        - text: 服务
          panel: SERVICE@ONEMODEL
    - name: hostList
      resolve:
        useProvider: basic.http-request
        args:
          - /preview/bricks/visual-builder/dist/fixtures/host-list.json?v=1
    - name: appList
      resolve:
        useProvider: basic.http-request
        args:
          - /preview/bricks/visual-builder/dist/fixtures/app-list.json
    - name: serviceList
      resolve:
        useProvider: basic.http-request
        args:
          - /preview/bricks/visual-builder/dist/fixtures/service-list.json
    - name: rawGenerations
      resolve:
        useProvider: basic.http-request
        args:
          - /preview/bricks/visual-builder/dist/fixtures/raw-generations.json?v=6
    - name: generations
      track: true
      value: |
        <%
          CTX.rawGenerations
            .filter((g) => g.objectId === CTX.modelId)
            .map((g) => ({
            ..._.pick(g, [
              "objectId",
              "objectName",
              "propertyId",
              "propertyName",
            ]),
            candidates: g.json,
            mockData:
              g.objectId === "HOST"
                ? CTX.hostList
                : g.objectId === "APP"
                ? CTX.appList
                : CTX.serviceList
          })).filter((g) => g.candidates)
        %>
- brick: visual-builder.raw-data-preview
  properties:
    previewUrl: /preview/
    theme: <% THEME.getTheme() %>
    uiVersion: "8.2"
    generations: <%= CTX.generations ?? [] %>
    style:
      height: calc(100vh - 4em - 72px)
```
