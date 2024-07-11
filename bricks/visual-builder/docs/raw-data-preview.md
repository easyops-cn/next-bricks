构件 `visual-builder.raw-data-preview`

## Examples

### Basic

```yaml preview
brick: visual-builder.raw-data-preview
properties:
  previewUrl: /preview/
  theme: <% THEME.getTheme() %>
  uiVersion: "8.2"
  generations: <% CTX.generations ?? [] %>
  style:
    height: calc(100vh - 4em)
context:
  - name: hostList
    resolve:
      useProvider: basic.http-request
      args:
        - /preview/bricks/visual-builder/dist/fixtures/host-list.json
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
        - /preview/bricks/visual-builder/dist/fixtures/raw-generations.json?v=2
  - name: generations
    value: |
      <%
        CTX.rawGenerations.map((g) => ({
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
```
