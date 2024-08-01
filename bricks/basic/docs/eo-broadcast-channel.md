构件 `eo-broadcast-channel`

## Examples

### Basic

```yaml preview
- brick: eo-button
  properties:
    textContent: Clone a tab and click me
  events:
    click:
      target: eo-broadcast-channel
      method: postMessage
      args:
        - Hello from eo-broadcast-channel
- brick: eo-broadcast-channel
  properties:
    channel: demo
  events:
    message:
      useProvider: basic.show-dialog
      args:
        - type: info
          content: <% EVENT.detail %>
```
