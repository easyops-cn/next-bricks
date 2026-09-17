---
tagName: eo-tag
displayName: WrappedEoTag
description: Tag brick supporting multiple preset and custom colors; it can be configured as checkable or closable, and supports icons, outline styles and text overflow ellipsis
category: display-component
source: "@next-bricks/basic"
---

# eo-tag

> Tag brick supporting multiple preset and custom colors; it can be configured as checkable or closable, and supports icons, outline styles and text overflow ellipsis

## Props

| property      | type                  | required | default | description                                   |
| ------------- | --------------------- | -------- | ------- | --------------------------------------------- |
| size          | `ComponentSize`       | no       | -       | Tag size                                      |
| icon          | `GeneralIconProps`    | no       | -       | Icon                                          |
| color         | `TagColor \| string`  | no       | -       | Color                                         |
| outline       | `boolean`             | no       | -       | Whether it has an outline                     |
| disabled      | `boolean`             | no       | -       | Whether it is disabled                        |
| closable      | `boolean`             | no       | -       | Whether it can be closed                      |
| ellipsisWidth | `string`              | no       | -       | Hidden width when the text exceeds the width  |
| checkable     | `boolean`             | no       | -       | Whether it can be checked                     |
| checked       | `boolean`             | no       | -       | Whether it is checked                         |
| tagStyle      | `React.CSSProperties` | no       | -       | Custom tag style                              |

## Events

| event | detail                                                                                                                                                                                                                                                       | description                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| check | `TagProps` — { size: tag size, icon: icon, color: color, outline: whether it has an outline, closable: whether it is closable, disabled: whether it is disabled, checkable: whether it is checkable, checked: current checked state, ellipsisWidth: hidden width on overflow, tagStyle: custom style } | Triggered when a checkable tag is clicked; returns the full properties of the current tag (including the updated checked state) |
| close | `TagProps` — { size: tag size, icon: icon, color: color, outline: whether it has an outline, closable: whether it is closable, disabled: whether it is disabled, checkable: whether it is checkable, checked: current checked state, ellipsisWidth: hidden width on overflow, tagStyle: custom style } | Triggered when the close button is clicked; the tag is hidden at the same time               |

## Examples

### Basic

Displays the basic usage of a default tag.

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Normal Item
```

### Closable & Event

Set `closable` to `true` to make the tag closable; the `close` event is triggered when it is closed.

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Normal Item
- brick: eo-tag
  properties:
    closable: true
    textContent: Closable Item
  events:
    close:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Checkable & Event

Set `checkable` to `true` to make the tag checkable; the `check` event is triggered when it is checked.

```yaml preview gap
- brick: eo-tag
  properties:
    checkable: true
    textContent: Check Item
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: eo-tag
  properties:
    checkable: true
    textContent: Default Checked Item
    checked: true
  events:
    check:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```

### Disabled

Set `disabled` to `true` to disable the tag; once disabled, both closing and checking are unavailable.

```yaml preview gap
- brick: eo-tag
  properties:
    closable: true
    checkable: true
    disabled: true
    textContent: Disabled Item
```

### Size

Use the `size` property to control the tag size; the `large`, `medium`, `small` and `xs` sizes are supported.

```yaml preview gap
- brick: eo-tag
  properties:
    size: large
    textContent: Large Item
- brick: eo-tag
  properties:
    size: medium
    textContent: Medium Item
- brick: eo-tag
  properties:
    size: small
    textContent: Small Item
- brick: eo-tag
  properties:
    size: xs
    textContent: XS Item
```

### Color

Use the `color` property to set the tag color; both preset colors and custom color values are supported.

```yaml preview gap
- brick: div
  properties:
    textContent: "Normal:"
- brick: eo-tag
  properties:
    color: gray
    textContent: Gray
- brick: eo-tag
  properties:
    color: red
    textContent: Red
- brick: eo-tag
  properties:
    color: orange
    textContent: Orange
- brick: eo-tag
  properties:
    color: yellow
    textContent: Yellow
- brick: eo-tag
  properties:
    color: blue
    textContent: Blue
- brick: eo-tag
  properties:
    color: geekblue
    textContent: Dark Blue
- brick: eo-tag
  properties:
    color: grayblue
    textContent: Gray Blue
- brick: eo-tag
  properties:
    color: cyan
    textContent: Light Blue
- brick: eo-tag
  properties:
    color: green
    textContent: Green
- brick: eo-tag
  properties:
    color: purple
    textContent: Purple
- brick: eo-tag
  properties:
    color: teal
    textContent: Teal
- brick: eo-tag
  properties:
    color: pink
    textContent: Pink
- brick: div
  properties:
    style:
      flexBasis: 100%
- brick: div
  properties:
    textContent: "Outline:"
- brick: eo-tag
  properties:
    color: gray
    outline: true
    textContent: Gray
- brick: eo-tag
  properties:
    color: red
    outline: true
    textContent: Red
- brick: eo-tag
  properties:
    color: orange
    outline: true
    textContent: Orange
- brick: eo-tag
  properties:
    color: yellow
    outline: true
    textContent: Yellow
- brick: eo-tag
  properties:
    color: blue
    outline: true
    textContent: Blue
- brick: eo-tag
  properties:
    color: geekblue
    outline: true
    textContent: Dark Blue
- brick: eo-tag
  properties:
    color: grayblue
    outline: true
    textContent: Gray Blue
- brick: eo-tag
  properties:
    color: cyan
    outline: true
    textContent: Light Blue
- brick: eo-tag
  properties:
    color: green
    outline: true
    textContent: Green
- brick: eo-tag
  properties:
    color: purple
    outline: true
    textContent: Purple
- brick: eo-tag
  properties:
    color: teal
    outline: true
    textContent: Teal
- brick: eo-tag
  properties:
    color: pink
    outline: true
    textContent: Pink
- brick: div
  properties:
    style:
      flexBasis: 100%
- brick: div
  properties:
    textContent: "Inverse:"
- brick: eo-tag
  properties:
    color: gray-inverse
    textContent: Gray
- brick: eo-tag
  properties:
    color: red-inverse
    textContent: Red
- brick: eo-tag
  properties:
    color: orange-inverse
    textContent: Orange
- brick: eo-tag
  properties:
    color: yellow-inverse
    textContent: Yellow
- brick: eo-tag
  properties:
    color: blue-inverse
    textContent: Blue
- brick: eo-tag
  properties:
    color: geekblue-inverse
    textContent: Dark Blue
- brick: eo-tag
  properties:
    color: grayblue-inverse
    textContent: Gray Blue
- brick: eo-tag
  properties:
    color: cyan-inverse
    textContent: Light Blue
- brick: eo-tag
  properties:
    color: green-inverse
    textContent: Green
- brick: eo-tag
  properties:
    color: purple-inverse
    textContent: Purple
- brick: eo-tag
  properties:
    color: teal-inverse
    textContent: Teal
- brick: eo-tag
  properties:
    color: pink-inverse
    textContent: Pink
```

### Custom Color

Use the `color` property to set a custom color value (not a preset color); the tag uses this color as its background color.

```yaml preview gap
- brick: eo-tag
  properties:
    color: "#f50"
    textContent: "#f50"
- brick: eo-tag
  properties:
    color: "#2db7f5"
    textContent: "#2db7f5"
- brick: eo-tag
  properties:
    color: "#87d068"
    textContent: "#87d068"
```

### Icon

Use the `icon` property to add an icon to the tag.

```yaml preview gap
- brick: eo-tag
  properties:
    icon:
      lib: antd
      icon: star
    textContent: Star Tag
```

### TagStyle

Use the `tagStyle` property to customize the tag style.

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: TagStyle
    tagStyle:
      color: "#abc"
      width: 200px
```

### EllipsisWidth

Use the `ellipsisWidth` property to set the truncation width when the text overflows.

```yaml preview gap
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 100px
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 150px
- brick: eo-tag
  properties:
    textContent: Hello World, This is over flow test
    ellipsisWidth: 300px
```
