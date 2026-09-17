---
tagName: eo-content-layout
displayName: WrappedEoContentLayout
description: Vertical flow layout for the content area, providing default spacing between child elements.
category: container-layout
source: "@next-bricks/containers"
---

# eo-content-layout

> Vertical flow layout for the content area, providing default spacing between child elements.

## Slots

| name        | description   |
| ----------- | ------------- |
| _(default)_ | Content area  |

## Examples

### Basic

Basic usage; lays out child elements in a vertical flow and adds spacing automatically.

```yaml preview
brick: eo-content-layout
children:
  - brick: eo-button
    properties:
      textContent: Hello
  - brick: eo-button
    properties:
      textContent: Goodbye
```
