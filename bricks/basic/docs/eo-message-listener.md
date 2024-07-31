用于监听 window.postMessage 事件的构件。

## Examples

### Basic

```yaml preview
- brick: eo-message-listener
  events:
    message:
      action: message.success
      args:
        - <% EVENT.detail.data.payload %>
- brick: eo-button
  properties:
    textContent: Send a message
  events:
    click:
      action: window.postMessage
      args:
        - type: test
          payload: Hello
```
