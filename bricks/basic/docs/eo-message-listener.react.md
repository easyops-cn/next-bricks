---
tagName: eo-message-listener
displayName: WrappedEoMessageListener
description: 用于监听 window.postMessage 事件的构件，可选择仅接收同源消息
category: data-display
source: "@next-bricks/basic"
---

# WrappedEoMessageListener

> 用于监听 window.postMessage 事件的构件，可选择仅接收同源消息

## 导入

```tsx
import { WrappedEoMessageListener } from "@easyops/wrapped-components";
```

## Props

| 属性       | 类型      | 必填 | 默认值 | 说明               |
| ---------- | --------- | ---- | ------ | ------------------ |
| sameOrigin | `boolean` | 否   | `true` | 是否仅接收同源消息 |

## Events

| 事件      | detail                                                             | 说明                          |
| --------- | ------------------------------------------------------------------ | ----------------------------- |
| onMessage | `MessageDetail` — `{ data: 消息数据内容, origin: 消息来源的域名 }` | 接收到 postMessage 消息时触发 |

## Examples

### Basic

监听来自同源页面发送的 postMessage 消息。

```tsx
<WrappedEoMessageListener
  onMessage={(e) => {
    console.log(e.detail.data, e.detail.origin);
  }}
/>
```

### Cross-Origin Messages

设置 `sameOrigin={false}` 以接收跨域消息。

```tsx
<WrappedEoMessageListener
  sameOrigin={false}
  onMessage={(e) => {
    console.log(
      "Origin:",
      e.detail.origin,
      "Data:",
      JSON.stringify(e.detail.data)
    );
  }}
/>
```
