---
tagName: eo-broadcast-channel
displayName: WrappedEoBroadcastChannel
description: Broadcast channel brick that implements cross-tab communication based on the BroadcastChannel API
category: other
source: "@next-bricks/basic"
---

# eo-broadcast-channel

> Broadcast channel brick that implements cross-tab communication based on the BroadcastChannel API

## Props

| property | type     | required | default | description                                                                                                                |
| -------- | -------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| channel  | `string` | yes      | -       | Broadcast channel name; see [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)      |

## Events

| event   | detail                          | description                                 |
| ------- | ------------------------------- | ------------------------------------------- |
| message | `unknown` — the received message content | Triggered when a message is received on the broadcast channel |

## Methods

| method      | params                                               | returns | description                            |
| ----------- | ---------------------------------------------------- | ------- | -------------------------------------- |
| postMessage | <ul><li>`data: unknown` - the message content to send</li></ul> | `void`  | Sends a message to the broadcast channel |

## Examples

### Basic

Demonstrates sending a message to the broadcast channel with the `postMessage` method and receiving the `message` event in another tab.

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
