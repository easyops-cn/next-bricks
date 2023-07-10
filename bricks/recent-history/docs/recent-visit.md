最近访问

## Examples

### Basic

```yaml preview gap
- brick: eo-button
  properties:
    textContent: Add history
  events:
    click:
      - useProvider: recent-history.push-history
        args:
          - playground
          - 5
          - key: <% _.uniqueId("playground-") %>
            name: <% _.uniqueId("playground-name") %>
- brick: recent-history.recent-visit
  properties:
    namespace: playground
    capacity: 5
```
