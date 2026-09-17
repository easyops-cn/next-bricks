---
tagName: eo-modal
displayName: WrappedEoModal
description: A modal brick that displays content as a masked overlay popup, supporting fullscreen, centering, custom width and height, a sidebar, keyboard ESC to close, and confirm/cancel button interaction
category: container-display
source: "@next-bricks/containers"
---

# eo-modal

> A modal brick that displays content as a masked overlay popup, supporting fullscreen, centering, custom width and height, a sidebar, keyboard ESC to close, and confirm/cancel button interaction

## Props

| property         | type                   | required | default   | description                                                                                                                   |
| ---------------- | ---------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| modalTitle       | `string`               | no       | -         | Title                                                                                                                         |
| width            | `string \| number`     | no       | `"520px"` | Width                                                                                                                         |
| height           | `string \| number`     | no       | -         | Height                                                                                                                        |
| minWidth         | `string \| number`     | no       | `"520px"` | Minimum width                                                                                                                 |
| minHeight        | `string \| number`     | no       | -         | Minimum height                                                                                                                |
| centered         | `boolean`              | no       | -         | Whether to display vertically centered. Defaults to `true` when `themeVariant` is set to `elevo`.                             |
| maskClosable     | `boolean`              | no       | -         | Whether clicking the mask closes the modal                                                                                    |
| fullscreen       | `boolean`              | no       | -         | Fullscreen mode                                                                                                               |
| fullscreenButton | `boolean`              | no       | -         | Whether to show the fullscreen button                                                                                         |
| noFooter         | `boolean`              | no       | -         | Whether to hide the footer                                                                                                    |
| headerBordered   | `boolean`              | no       | -         | Whether to show the header bottom border (the header bottom border is hidden by default when themeVariant is elevo)           |
| background       | `string`               | no       | -         | Background                                                                                                                    |
| closeWhenConfirm | `boolean`              | no       | `true`    | Automatically closes the modal when the confirm button is clicked                                                             |
| confirmDisabled  | `boolean`              | no       | -         | Whether the confirm button is disabled                                                                                        |
| visible          | `boolean`              | no       | -         | Whether to show the modal                                                                                                     |
| confirmText      | `string`               | no       | -         | Confirm button text                                                                                                           |
| cancelText       | `string`               | no       | -         | Cancel button text                                                                                                            |
| confirmDanger    | `boolean`              | no       | -         | Confirm button type (danger style)                                                                                            |
| hideCancelButton | `boolean`              | no       | -         | Whether to hide the cancel button                                                                                             |
| keyboard         | `boolean`              | no       | -         | Whether to support closing with the keyboard ESC key                                                                          |
| themeVariant     | `"default" \| "elevo"` | no       | -         | Theme variant                                                                                                                 |
| stackable        | `boolean`              | no       | -         | Whether it is stackable; when enabled, each newly opened modal is placed on top (zIndex ++). Note: only the initial setting takes effect. (Deprecated) |

## Events

| event   | detail | description          |
| ------- | ------ | -------------------- |
| open    | `void` | Modal open event     |
| close   | `void` | Modal close event    |
| confirm | `void` | Confirm button event |
| cancel  | `void` | Cancel button event  |

## Methods

| method | params | returns | description               |
| ------ | ------ | ------- | ------------------------- |
| open   | -      | `void`  | Method to open the modal  |
| close  | -      | `void`  | Method to close the modal |

## Slots

| name      | description        |
| --------- | ------------------ |
| (default) | Content slot       |
| footer    | Footer left slot   |
| sidebar   | Modal left slot    |

## Examples

### Basic

The basic usage of displaying a modal directly through the `visible` property.

```html preview minHeight="320px"
<eo-modal modal-title="Modal Title" visible="true">Content</eo-modal>
```

### Width & Height

Control the modal size with the `width`, `height`, `minWidth` and `minHeight` properties.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Modal
  events:
    click:
      - target: "#modal"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal"
    modalTitle: Modal Title
    width: 600px
    height: 300px
    minWidth: 400px
    minHeight: 200px
  children:
    - brick: div
      properties:
        textContent: Content
```

### Centered

Vertically center the modal with the `centered` property.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Centered Modal
  events:
    click:
      - target: "#modal-centered"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-centered"
    modalTitle: Centered Modal
    centered: true
  children:
    - brick: div
      properties:
        textContent: Modal content
```

### MaskClosable

Use `maskClosable` to control whether clicking the mask closes the modal.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Mask Allow Close
  events:
    click:
      - target: "#modal-mask-allow-close"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: Modal Title
    id: "modal-mask-allow-close"
    maskClosable: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Modal content
- brick: eo-button
  properties:
    textContent: Mask Not Allow Close
  events:
    click:
      - target: "#modal-mast-not-allow-close"
        method: open
- brick: eo-modal
  properties:
    modalTitle: Modal Title
    id: "modal-mast-not-allow-close"
    maskClosable: false
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Modal content
```

### Fullscreen & Fullscreen Button

Enable fullscreen mode with the `fullscreen` property; `fullscreenButton` shows the fullscreen toggle button.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Fullscreen Modal
  events:
    click:
      - target: "#modal-fullscreen"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: Fullscreen Modal
    id: "modal-fullscreen"
    fullscreen: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Modal content
- brick: eo-button
  properties:
    textContent: Open With Fullscreen Button
  events:
    click:
      - target: "#modal-fullscreen-btn"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: Fullscreen Toggleable
    id: "modal-fullscreen-btn"
    fullscreenButton: true
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Modal content
```

### Confirm Text & Cancel Text

Customize the footer button text with `confirmText` and `cancelText`.

```html preview minHeight="320px"
<eo-modal
  modal-title="Modal Title"
  visible="true"
  confirm-text="Submit"
  cancel-text="Discard"
>
  Content
</eo-modal>
```

### Hide Cancel Button

Hide the cancel button with `hideCancelButton`, for scenarios that only need confirmation.

```html preview minHeight="320px"
<eo-modal modal-title="Modal Title" visible="true" hide-cancel-button="true">
  Content
</eo-modal>
```

### Confirm Danger & Disabled

Use `confirmDanger` for a danger-style confirm button and `confirmDisabled` to disable the confirm button.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Danger Modal
  events:
    click:
      - target: "#modal-danger"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-danger"
    modalTitle: Delete Confirmation
    confirmDanger: true
    confirmText: Delete
  children:
    - brick: div
      properties:
        textContent: Delete this item?
- brick: eo-button
  properties:
    textContent: Open Disabled Confirm Modal
  events:
    click:
      - target: "#modal-disabled"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-disabled"
    modalTitle: Confirm Button Disabled
    confirmDisabled: true
  children:
    - brick: div
      properties:
        textContent: The confirm button cannot be clicked.
```

### No Footer

Hide the footer area with `noFooter`, for display-only scenarios.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open
  events:
    click:
      - target: "#modal-no-footer"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-no-footer"
    modalTitle: Modal Without Footer
    noFooter: true
  children:
    - brick: div
      properties:
        textContent: Content only, without footer buttons.
```

### Background & Header Bordered

Set the modal background color with `background` and show the header bottom border with `headerBordered`.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Styled Modal
  events:
    click:
      - target: "#modal-styled"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-styled"
    modalTitle: Custom Background
    background: "#f5f5f5"
    headerBordered: true
  children:
    - brick: div
      properties:
        textContent: A modal with a custom background and a header bottom border.
```

### Events

Listen to the `open`, `close`, `confirm` and `cancel` events; together with the `keyboard` property this supports closing with the ESC key, and `closeWhenConfirm` controls whether the modal closes automatically after confirmation.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal-events"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: Modal Title
    id: "modal-events"
    keyboard: true
    closeWhenConfirm: false
  events:
    open:
      - action: message.success
        args:
          - modal Open
    close:
      - action: message.success
        args:
          - modal Close
    confirm:
      - action: message.success
        args:
          - modal Confirm
    cancel:
      - action: message.success
        args:
          - modal Cancel
  children:
    - brick: div
      properties:
        textContent: Content
```

### Sidebar Slot

Use the `sidebar` slot to place content (such as a navigation menu) on the left side of the modal.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: open
  events:
    click:
      - target: "#modal-sidebar"
        method: open
- brick: eo-modal
  portal: true
  properties:
    modalTitle: Modal Title
    id: "modal-sidebar"
    keyboard: true
    width: 700px
  events:
    open:
      - action: message.success
        args:
          - modal Open
    close:
      - action: message.success
        args:
          - modal Close
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Content
      type: bricks
    sidebar:
      bricks:
        - brick: div
          properties:
            textContent: Sidebar
      type: bricks
```

### Footer Slot

Use the `footer` slot to place custom content at the bottom left of the modal.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open
  events:
    click:
      - target: "#modal-footer-slot"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-footer-slot"
    modalTitle: Modal With Footer Slot
  slots:
    "":
      bricks:
        - brick: div
          properties:
            textContent: Modal content
      type: bricks
    footer:
      bricks:
        - brick: span
          properties:
            textContent: Custom footer left content
      type: bricks
```

### Theme Variant

Switch the theme variant with the `themeVariant` property; under the `elevo` theme the modal is centered by default and has no header bottom border.

```yaml preview minHeight="320px"
- brick: eo-button
  properties:
    textContent: Open Elevo Theme Modal
  events:
    click:
      - target: "#modal-elevo"
        method: open
- brick: eo-modal
  portal: true
  properties:
    id: "modal-elevo"
    modalTitle: Elevo Theme Modal
    themeVariant: elevo
  children:
    - brick: div
      properties:
        textContent: A modal using the elevo theme variant.
```
