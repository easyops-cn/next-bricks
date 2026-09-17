---
tagName: eo-popup
displayName: WrappedEoPopup
description: A draggable floating popup container.
category: container-display
source: "@next-bricks/containers"
---

# eo-popup

> A draggable floating popup container.

## Props

| property      | type                                                                   | required | default    | description                                                                                                          |
| ------------- | ---------------------------------------------------------------------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| popupId       | `string`                                                               | no       | -          | Popup ID; once set, position recording is enabled and the last position and size are restored the next time it opens |
| popupWidth    | `string \| number`                                                     | no       | `500`      | Popup width                                                                                                          |
| popupHeight   | `string \| number`                                                     | no       | -          | Popup height                                                                                                         |
| popupTitle    | `string`                                                               | no       | -          | Popup title                                                                                                          |
| openDirection | `"leftTop" \| "leftBottom" \| "rightTop" \| "rightBottom" \| "center"` | no       | `"center"` | Popup open position                                                                                                  |
| visible       | `boolean`                                                              | no       | -          | Whether to show the modal                                                                                            |
| headerStyle   | `React.CSSProperties`                                                  | no       | -          | Used to set the style of the popup header                                                                            |
| wrapperStyle  | `React.CSSProperties`                                                  | no       | -          | Used to set the style of the popup container                                                                         |
| noPadding     | `boolean`                                                              | no       | -          | The content has no padding                                                                                           |
| resizable     | `boolean`                                                              | no       | -          | Whether it can be resized                                                                                            |

## Methods

| method | params | returns | description   |
| ------ | ------ | ------- | ------------- |
| open   | -      | `void`  | Show the popup |
| close  | -      | `void`  | Close the popup |

## Slots

| name      | description       |
| --------- | ----------------- |
| (default) | Content area      |
| toolbar   | Header toolbar slot |

## Examples

### Basic

Displays the basic usage of the floating popup.

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: Popup
  popupHeight: 300px
  visible: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### Method & PopupId

Control the popup display with the `open` / `close` methods; `popupId` enables the position recording feature.

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Open Popup
  events:
    click:
      - target: "#popup"
        method: open
- brick: eo-button
  properties:
    textContent: Close Popup
  events:
    click:
      - target: "#popup"
        method: close
- brick: eo-popup
  properties:
    popupTitle: Button Open
    popupHeight: 400px
    id: popup
    popupId: popupA
  children:
    - brick: div
      properties:
        textContent: Hello, I'm content!
```

### Resizable

The `resizable` property lets users resize the popup.

```yaml preview minHeight="500px"
brick: eo-popup
properties:
  popupTitle: resizable
  visible: true
  resizable: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
```

### Toolbar Slot

Use the `toolbar` slot to place tool buttons on the right of the header.

```yaml preview minHeight="300px"
brick: eo-popup
properties:
  popupTitle: resizable
  popupHeight: 200px
  visible: true
children:
  - brick: div
    properties:
      textContent: Hello, I'm content!
  - brick: eo-icon
    slot: toolbar
    properties:
      icon: edit
      lib: antd
      style:
        cursor: pointer
    events:
      click:
        - action: message.success
          args:
            - edit
```

### Open Direction

Control the initial position where the popup appears with `openDirection`.

```yaml preview minHeight="500px"
- brick: eo-button
  properties:
    textContent: Left Top
  events:
    click:
      - target: "#popup-lt"
        method: open
- brick: eo-button
  properties:
    textContent: Right Bottom
  events:
    click:
      - target: "#popup-rb"
        method: open
- brick: eo-popup
  properties:
    id: popup-lt
    popupTitle: Left Top
    popupHeight: 200px
    openDirection: leftTop
  children:
    - brick: div
      properties:
        textContent: Opened from left top
- brick: eo-popup
  properties:
    id: popup-rb
    popupTitle: Right Bottom
    popupHeight: 200px
    openDirection: rightBottom
  children:
    - brick: div
      properties:
        textContent: Opened from right bottom
```

### No Padding

Remove the content area padding with `noPadding`, for full-size content scenarios.

```yaml preview minHeight="400px"
brick: eo-popup
properties:
  popupTitle: No Padding
  popupHeight: 300px
  visible: true
  noPadding: true
children:
  - brick: div
    properties:
      textContent: Full-width content without padding
      style:
        background: var(--palette-blue-2)
        padding: 16px
        height: 100%
```
