---
tagName: eo-message-listener
displayName: WrappedEoMessageListener
description: 用于监听 window.postMessage 事件的构件，可选择仅接收同源消息
category: data-display
source: "@next-bricks/basic"
---

# eo-message-listener

> 用于监听 window.postMessage 事件的构件，可选择仅接收同源消息

## Props

| 属性       | 类型      | 必填 | 默认值 | 说明               |
| ---------- | --------- | ---- | ------ | ------------------ |
| sameOrigin | `boolean` | 否   | `true` | 是否仅接收同源消息 |

## Events

| 事件    | detail                                                             | 说明                          |
| ------- | ------------------------------------------------------------------ | ----------------------------- |
| message | `MessageDetail` — `{ data: 消息数据内容, origin: 消息来源的域名 }` | 接收到 postMessage 消息时触发 |

## Examples

### Basic

监听来自同源页面发送的 postMessage 消息。

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

设置 `sameOrigin: false` 以接收跨域消息。

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
