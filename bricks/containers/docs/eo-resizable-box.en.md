---
tagName: eo-resizable-box
displayName: WrappedEoResizableBox
description: A container that can be resized horizontally or vertically.
category: container-layout
source: "@next-bricks/containers"
---

# eo-resizable-box

> A container that can be resized horizontally or vertically.

Note the differences from the v2 brick `basic-bricks.resizable-box`:

- The `resizable` property is removed; use `disabled` to control whether the box is resizable instead;
- It lives in the `containers-NB` package instead of `basic-bricks-NB`.

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| resizeDirection | `"left" \| "right" \| "top" \| "bottom"` | no | `"right"` | Resize direction, controlling which side of the container the drag bar appears on |
| storageKey | `string` | no | - | The localStorage key used to store the current size; once set, the size is persisted |
| defaultSize | `number` | no | `200` | Default size (px) |
| minSize | `number` | no | `defaultSize` | Minimum size (px) |
| minSpace | `number` | no | `300` | Minimum space (px) reserved for the other parts. Keeps the size from exceeding `documentElement.clientWidth - minSpace` (in the horizontal direction). |
| disabled | `boolean` | no | - | Disable resizing |
| variant | `"dashboard" \| "default"` | no | `"default"` | Drag bar style variant |
| boxStyle | `React.CSSProperties` | no | - | Custom style of the box container |
| boxStyleWhenNotResizing | `React.CSSProperties` | no | - | Custom style of the box container when not resizing |
| syncSizeWithHost | `boolean` | no | - | Whether to sync the size to the host element; once set, the width or height of the host element updates along with the dragging |

## Slots

| name | description |
| --- | --- |
| (default) | Content area |

## Examples

### Basic

Shows the basic usage of a resizable container; drag the divider on the right to resize the width.

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-basic
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```

### Direction

Controls the drag direction via the `resizeDirection` property; vertical resizing is supported.

```yaml preview
brick: div
properties:
  style:
    display: flex
    flexDirection: column
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-direction
      resizeDirection: bottom
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderTop: 1px solid var(--theme-gray-border-color)
```

### Sizing

Controls the size range via `minSize` and `minSpace`, limiting the minimum and maximum resizable size.

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-sizing
      minSize: 100
      minSpace: 100
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```

### Dashboard

Sets the dashboard style variant of the drag bar via the `variant` property.

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Hello
      storageKey: demo-dashboard
      variant: dashboard
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```

### Disabled

Disables resizing via the `disabled` property.

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Fixed (disabled resize)
      disabled: true
      defaultSize: 200
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```

### Box Style

Customizes the container style via `boxStyle` and `boxStyleWhenNotResizing`.

```yaml preview
brick: div
properties:
  style:
    display: flex
    height: calc(100vh - 4em)
    border: 1px solid var(--theme-gray-border-color)
children:
  - brick: eo-resizable-box
    properties:
      textContent: Styled box
      storageKey: demo-style
      boxStyle:
        background: var(--palette-blue-2)
      boxStyleWhenNotResizing:
        transition: width 0.1s ease
  - brick: div
    properties:
      textContent: World
      style:
        flex: 1
        borderLeft: 1px solid var(--theme-gray-border-color)
```
