---
tagName: eo-iframe
displayName: WrappedEoIframe
description: An embedded web page brick that embeds an external page into the current page through an iframe
category: display-component
source: "@next-bricks/basic"
---

# eo-iframe

> An embedded web page brick that embeds an external page into the current page through an iframe

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| src | `string` | - | - | Source address of the iframe |
| iframeStyle | `CSSProperties` | - | - | Custom style of the iframe; the default style is 100% width and height with no margin |

## Events

| event | detail | description |
| --- | --- | --- |
| load | `void` | Triggered when the iframe finishes loading |

## Methods

| method | params | returns | description |
| --- | --- | --- | --- |
| postMessage | <ul><li>`args: PostMessageParameters` - Parameters passed to iframe contentWindow.postMessage; both the (message, targetOrigin, transfer?) and (message, options?) signatures are supported</li></ul> | `void` | Sends a postMessage to the iframe |

## Examples

### Basic Usage

Embeds an external page into the current page; by default the iframe fills the width and height of its parent container.

```yaml preview
brick: eo-iframe
properties:
  src: "https://example.com"
  iframeStyle:
    height: 400px
```

### Listening for the Load Event

Performs an action after the page finishes loading; listen for the `load` event to know when the iframe has finished loading.

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

### Communicating with the iframe via postMessage

Sends a message to the page inside the iframe by calling the `postMessage` method.

```yaml preview
- brick: eo-iframe
  ref: myIframe
  properties:
    src: "https://example.com"
    iframeStyle:
      height: 400px
- brick: eo-button
  properties:
    textContent: Send Message
  events:
    click:
      - target: "#myIframe"
        method: postMessage
        args:
          - hello iframe
          - "*"
```
