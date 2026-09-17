---
tagName: eo-tooltip
displayName: WrappedEoTooltip
description: A tooltip brick that shows a tooltip bubble on mouse hover or click; it supports multiple placements, icon mode, custom content slots and manual control of visibility
category: feedback-and-tooltip
source: "@next-bricks/basic"
---

# eo-tooltip

> A tooltip brick that shows a tooltip bubble on mouse hover or click; it supports multiple placements, icon mode, custom content slots and manual control of visibility

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| icon | `GeneralIconProps` | - | - | Icon |
| content | `string` | - | - | Content |
| placement | `Placement` | - | - | Placement |
| disabled | `boolean` | - | `false` | Whether it is disabled |
| open | `boolean` | - | - | Whether it is visible |
| trigger | `string` | - | - | Trigger mode, including `click` \| `hover` \| `focus` \| `manual`; multiple values can be separated by spaces |
| hoist | `boolean` | - | - | Whether to use fixed positioning to prevent the content from being clipped |
| maxWidth | `string` | - | `"250px"` | Maximum width |

## Events

| event | detail | description |
| --- | --- | --- |
| open.change | `boolean` — whether it is currently visible | Triggered when the tooltip visibility starts to change |
| after.open.change | `boolean` — whether it is currently visible | Triggered after the tooltip visibility change completes and all animations finish |

## Methods

| method | params | returns | description |
| --- | --- | --- | --- |
| show | - | `void` | Show the tooltip |
| hide | - | `void` | Hide the tooltip |

## Slots

| name | description |
| --- | --- |
| (default) | The tooltip target element |
| content | The element placed inside the tooltip |

## Examples

### Basic

Sets the tooltip text via `content`, specifies the trigger mode via `trigger`, and uses the `open.change` and `after.open.change` events to listen for visibility changes.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    events:
      open.change:
        - action: console.log
          args:
            - open.change
            - <% EVENT.detail %>
      after.open.change:
        - action: console.log
          args:
            - after.open.change
            - <% EVENT.detail %>
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
```

### Icon

Configures an icon as the trigger target of the tooltip via the `icon` property.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      icon:
        lib: antd
        icon: search
      trigger: hover
    events:
      open.change:
        - action: console.log
          args:
            - open.change
            - <% EVENT.detail %>
      after.open.change:
        - action: console.log
          args:
            - after.open.change
            - <% EVENT.detail %>
```

### Trigger

The `trigger` property supports four trigger modes: `hover`, `click`, `focus` and `manual`.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: click
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: click
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: focus
    children:
      - brick: eo-input
        properties:
          type: primary
          textContent: focus
```

### Placement

Controls the placement direction of the tooltip via the `placement` property.

```yaml preview
brick: div
properties:
  style:
    margin: 150px
    display: grid
    grid-template-areas: |
      ". top-start top top-end ."
      "left-start . . . right-start"
      "left . . . right"
      "left-end . . . right-end"
      ". bottom-start bottom bottom-end ."
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr
    gap: 20px
children:
  - brick: :forEach
    dataSource:
      - top-start
      - top
      - top-end
      - right-start
      - right
      - right-end
      - bottom-start
      - bottom
      - bottom-end
      - left-start
      - left
      - left-end
    slots:
      "":
        bricks:
          - brick: eo-tooltip
            properties:
              content: This is a tooltip
              trigger: hover
              placement: <% ITEM %>
              style:
                grid-area: <% ITEM %>
            children:
              - brick: eo-button
                properties:
                  type: primary
                  textContent: <% ITEM %>
```

### Disabled

Sets the `disabled` property to disable the tooltip so that it no longer pops up on mouse hover.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      disabled: true
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: disabled tooltip
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      disabled: false
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: enabled tooltip
```

### MaxWidth

Controls the maximum width of the tooltip bubble via the `maxWidth` property; the default is 250px.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a very long tooltip text used to demonstrate line wrapping under the default width; when the content exceeds the maximum width it wraps automatically.
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: Default width
  - brick: eo-tooltip
    properties:
      content: This is a very long tooltip text used to demonstrate line wrapping under a custom width; when the content exceeds the maximum width it wraps automatically.
      trigger: hover
      maxWidth: 400px
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: maxWidth 400px
```

### Hoist

`hoist: true` uses fixed positioning to prevent the tooltip content from being clipped by the parent element's `overflow: hidden`.

```yaml preview
brick: div
properties:
  style:
    position: relative
    display: flex
    margin: 50px
    padding: 20px
    border: 1px solid red
    overflow: hidden
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      hoist: false
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
      hoist: true
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
```

### Slot

The `content` slot can hold rich text as the tooltip content, which is more flexible than the plain-text `content` property.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 100px
children:
  - brick: eo-tooltip
    properties:
      content: This is a tooltip
      trigger: hover
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: hover
  - brick: eo-tooltip
    properties:
      trigger: hover
    slots:
      "content":
        bricks:
          - brick: strong
            properties:
              style:
                color: red
              textContent: This is a tooltip
      "":
        bricks:
          - brick: eo-button
            properties:
              type: primary
              textContent: hover
```

### Methods

Call the `show()` method to display the tooltip programmatically and the `hide()` method to hide it.

```yaml preview
brick: div
properties:
  style:
    margin: 50px
    display: flex
    gap: 20px
children:
  - brick: eo-tooltip
    iid: myTooltip
    properties:
      content: This is a tooltip
      trigger: manual
    children:
      - brick: eo-button
        properties:
          type: primary
          textContent: Target
  - brick: eo-button
    properties:
      textContent: Show
    events:
      click:
        target: "#myTooltip"
        method: show
  - brick: eo-button
    properties:
      textContent: Hide
    events:
      click:
        target: "#myTooltip"
        method: hide
```
