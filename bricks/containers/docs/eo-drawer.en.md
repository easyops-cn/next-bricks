---
tagName: eo-drawer
displayName: WrappedEoDrawer
description: A general-purpose drawer brick
category: container-display
source: "@next-bricks/containers"
---

# eo-drawer

> A general-purpose drawer brick

## Props

| property            | type                   | required | default   | description                                                                                              |
| ------------------- | ---------------------- | -------- | --------- | -------------------------------------------------------------------------------------------------------- |
| customTitle         | `string`               | -        | -         | Title                                                                                                    |
| subTitle            | `string`               | -        | -         | Subtitle                                                                                                 |
| width               | `number \| string`     | -        | `500`     | Width (effective when placement is left or right)                                                        |
| height              | `number \| string`     | -        | `378`     | Height (effective when placement is top or bottom)                                                       |
| closable            | `boolean`              | -        | `true`    | Whether to show the close button in the upper right corner                                               |
| mask                | `boolean`              | -        | `true`    | Whether to show the mask                                                                                 |
| maskClosable        | `boolean`              | -        | `true`    | Whether clicking the mask closes the drawer                                                              |
| visible             | `boolean`              | -        | `false`   | Whether the drawer is visible                                                                            |
| footerSlot          | `boolean`              | -        | `false`   | Whether the footer slot exists; when enabled, the footer slot area is displayed                          |
| placement           | `Placement`            | -        | `"right"` | Drawer open direction. Allowed values: "left" \| "right" \| "top" \| "bottom"                            |
| scrollToTopWhenOpen | `boolean`              | -        | `true`    | Whether the content area automatically scrolls to the top when the drawer opens (only effective on initial setup) |
| maskStyle           | `object`               | -        | `{}`      | Custom style of the mask                                                                                 |
| keyboard            | `boolean`              | -        | -         | Whether closing with the keyboard esc key is supported                                                   |
| themeVariant        | `"default" \| "elevo"` | -        | -         | Theme variant. Allowed values: "default" \| "elevo", controlled through CSS attribute selectors           |
| stackable           | `boolean`              | -        | -         | Whether it is stackable; when enabled, each newly opened drawer is placed on top (zIndex ++) (only effective on initial setup, deprecated) |

## Events

| event | detail | description        |
| ----- | ------ | ------------------ |
| open  | -      | Drawer open event  |
| close | -      | Drawer close event |

## Methods

| method | params | returns | description         |
| ------ | ------ | ------- | ------------------- |
| open   | -      | `void`  | Drawer open method  |
| close  | -      | `void`  | Drawer close method |

## Slots

| name       | description                                    |
| ---------- | ---------------------------------------------- |
| -          | Drawer content slot                            |
| headerLeft | Top left of the header (right of the title)    |
| extra      | Top right of the header (left of the close button) |
| footer     | Drawer footer slot                             |

## Examples

### Basic

Open the drawer via the open method triggered by a button, showing the basic usage.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Drawer
  events:
    click:
      - target: "#drawer-basic"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    subTitle: Subtitle
    id: "drawer-basic"
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```

### Placement

Set the direction the drawer opens from with the placement property.

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Top
  events:
    click:
      - target: "#drawer-top"
        method: open
- brick: eo-button
  properties:
    textContent: Left
  events:
    click:
      - target: "#drawer-left"
        method: open
- brick: eo-button
  properties:
    textContent: Right
  events:
    click:
      - target: "#drawer-right"
        method: open
- brick: eo-button
  properties:
    textContent: Bottom
  events:
    click:
      - target: "#drawer-bottom"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-top"
    placement: top
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-left"
    placement: left
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-right"
    placement: right
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-bottom"
    placement: bottom
```

### Width

Set the width of a left or right drawer with the width property.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-width"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-width"
    width: 200
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```

### Height

Set the height of a top or bottom drawer with the height property.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-height"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-height"
    height: 200
    placement: top
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```

### Closable

Control whether the close button in the upper right corner is shown with the closable property.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Show Close
  events:
    click:
      - target: "#drawer-show-close"
        method: open
- brick: eo-button
  properties:
    textContent: Hide Close
  events:
    click:
      - target: "#drawer-hide-close"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-show-close"
  children:
    - brick: div
      properties:
        textContent: Drawer Content
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-hide-close"
    closable: false
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```

### Mask

Control whether the mask is shown with the mask property; maskClosable controls whether clicking the mask closes the drawer.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Show Mask
  events:
    click:
      - target: "#drawer-show-mask"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-show-mask"
    mask: true
    maskClosable: true
  children:
    - brick: div
      properties:
        textContent: Drawer Content
- brick: eo-button
  properties:
    textContent: Hide Mask
  events:
    click:
      - target: "#drawer-hide-mask"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-hide-mask"
    mask: false
    maskClosable: false
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```

### Slots

Use the footerSlot, headerLeft, extra and footer slots to customize the header and footer areas of the drawer.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-slots"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-slots"
    footerSlot: true
  children:
    - brick: div
      properties:
        textContent: Drawer Content
    - brick: div
      slot: footer
      properties:
        textContent: Footer Content
    - brick: div
      slot: extra
      properties:
        textContent: Header Extra
    - brick: div
      slot: headerLeft
      properties:
        textContent: Header Left
```

### Open Event & Close Event

Listen for the open and close events of the drawer; closing with keyboard (the esc key) and closing through the close method are both supported.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-events"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-events"
    placement: left
    keyboard: true
  events:
    open:
      - action: message.success
        args:
          - Drawer Open
    close:
      - action: message.success
        args:
          - Drawer Close
  children:
    - brick: eo-button
      properties:
        textContent: Close Drawer
      events:
        click:
          - target: "#drawer-events"
            method: "close"
```

### Nested

Drawers can be nested, opening one drawer inside another.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open drawer
  events:
    click:
      - target: "#drawer-nested-1"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Drawer Title
    id: "drawer-nested-1"
    keyboard: true
  children:
    - brick: eo-button
      properties:
        textContent: Open nested drawer
      events:
        click:
          - target: "#drawer-nested-2"
            method: "open"
- brick: eo-drawer
  properties:
    customTitle: Nested Drawer Title
    id: "drawer-nested-2"
    keyboard: true
    width: 400
    textContent: This is a nested drawer.
```

### Custom Mask Style & Scroll To Top

Customize the mask style and use scrollToTopWhenOpen to control whether the content scrolls to the top when the drawer opens.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-mask-style"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Custom Mask Style
    id: "drawer-mask-style"
    scrollToTopWhenOpen: true
    maskStyle:
      backgroundColor: "rgba(0, 0, 0, 0.8)"
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```

### Theme Variant

Switch the theme variant with the themeVariant property.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#drawer-theme"
        method: open
- brick: eo-drawer
  properties:
    customTitle: Elevo Theme
    id: "drawer-theme"
    themeVariant: elevo
  children:
    - brick: div
      properties:
        textContent: Drawer Content
```
