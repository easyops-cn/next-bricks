---
tagName: eo-message-listener
displayName: WrappedEoMessageListener
description: A brick for listening to window.postMessage events; it can be configured to receive same-origin messages only
category: data-display
source: "@next-bricks/basic"
---

# eo-message-listener

> A brick for listening to window.postMessage events; it can be configured to receive same-origin messages only

## Props

| property   | type      | required | default | description                          |
| ---------- | --------- | -------- | ------- | ------------------------------------ |
| sameOrigin | `boolean` | no       | `true`  | Whether to receive same-origin messages only |

## Events

| event   | detail                                                             | description                             |
| ------- | ------------------------------------------------------------------ | --------------------------------------- |
| message | `MessageDetail` — `{ data: message data content, origin: domain of the message source }` | Triggered when a postMessage message is received |

## Examples

### Basic

Listens for postMessage messages sent from same-origin pages.

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

### Cross-Origin Messages

Set `sameOrigin: false` to receive cross-origin messages.

```yaml preview
- brick: eo-message-listener
  properties:
    sameOrigin: false
  events:
    message:
      action: message.info
      args:
        - '<% "Origin: " + EVENT.detail.origin + " Data: " + JSON.stringify(EVENT.detail.data) %>'
```
