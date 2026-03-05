---
tagName: eo-iframe
displayName: WrappedEoIframe
description: 内嵌网页构件，通过 iframe 将外部页面嵌入当前页面
category: display-component
source: "@next-bricks/basic"
---

# eo-iframe

> 内嵌网页构件，通过 iframe 将外部页面嵌入当前页面

## Props

| 属性        | 类型            | 必填 | 默认值 | 说明                                             |
| ----------- | --------------- | ---- | ------ | ------------------------------------------------ |
| src         | `string`        | -    | -      | iframe 的源地址                                  |
| iframeStyle | `CSSProperties` | -    | -      | iframe 的自定义样式，默认样式为宽高 100%、无边距 |

## Events

| 事件 | detail | 说明                  |
| ---- | ------ | --------------------- |
| load | `void` | iframe 加载完成时触发 |

## Methods

| 方法        | 参数                                                                                                                                                                      | 返回值 | 说明                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------- |
| postMessage | <ul><li>`args: PostMessageParameters` - 传递给 iframe contentWindow.postMessage 的参数，支持 (message, targetOrigin, transfer?) 和 (message, options?) 两种签名</li></ul> | `void` | 向 iframe 发送 postMessage |

## Examples

### 基础用法

将外部页面嵌入当前页面，iframe 默认占满父容器的宽高。

```yaml preview
brick: eo-iframe
properties:
  src: "https://example.com"
  iframeStyle:
    height: 400px
```

### 监听加载完成事件

页面加载完成后执行操作，通过监听 `load` 事件获知 iframe 完成加载。

```yaml preview
brick: eo-iframe
properties:
  src: "https://example.com"
  iframeStyle:
    height: 400px
events:
  load:
    - action: console.log
      args:
        - "iframe loaded"
```

### 使用 postMessage 与 iframe 通信

通过调用 `postMessage` 方法向 iframe 内部的页面发送消息。

```yaml preview
- brick: eo-iframe
  ref: myIframe
  properties:
    src: "https://example.com"
    iframeStyle:
      height: 400px
- brick: eo-button
  properties:
    textContent: 发送消息
  events:
    click:
      - target: "#myIframe"
        method: postMessage
        args:
          - hello iframe
          - "*"
```
