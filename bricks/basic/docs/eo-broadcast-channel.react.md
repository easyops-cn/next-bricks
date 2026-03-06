---
tagName: eo-broadcast-channel
displayName: WrappedEoBroadcastChannel
description: 广播频道构件，基于 BroadcastChannel API 实现跨标签页通信
category: other
source: "@next-bricks/basic"
---

# WrappedEoBroadcastChannel

> 广播频道构件，基于 BroadcastChannel API 实现跨标签页通信

## 导入

```tsx
import { WrappedEoBroadcastChannel } from "@easyops/wrapped-components";
```

## Props

| 属性    | 类型     | 必填 | 默认值 | 说明                                                                                                          |
| ------- | -------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------- |
| channel | `string` | 是   | -      | 广播频道名称，详见 [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) |

## Events

| 事件      | detail                       | 说明                   |
| --------- | ---------------------------- | ---------------------- |
| onMessage | `unknown` — 接收到的消息内容 | 收到广播频道消息时触发 |

## Methods

| 方法        | 参数                                                 | 返回值 | 说明                   |
| ----------- | ---------------------------------------------------- | ------ | ---------------------- |
| postMessage | <ul><li>`data: unknown` - 要发送的消息内容</li></ul> | `void` | 向广播频道发送一条消息 |

## Examples

### Basic

演示使用 `postMessage` 方法向广播频道发送消息，在另一个标签页中接收 `onMessage` 事件。

```tsx
import { useRef } from "react";

function App() {
  const channelRef = useRef<any>(null);

  return (
    <>
      <WrappedEoButton
        onClick={() =>
          channelRef.current?.postMessage("Hello from eo-broadcast-channel")
        }
      >
        Clone a tab and click me
      </WrappedEoButton>
      <WrappedEoBroadcastChannel
        ref={channelRef}
        channel="demo"
        onMessage={(e) => {
          // show dialog with e.detail
          console.log(e.detail);
        }}
      />
    </>
  );
}
```
