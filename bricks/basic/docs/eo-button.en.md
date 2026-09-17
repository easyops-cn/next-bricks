---
tagName: eo-button
displayName: WrappedEoButton
description: A general-purpose button brick
category: interact-basic
source: "@next-bricks/basic"
---

# eo-button

> A general-purpose button brick

## Props

| property     | type                   | required | default     | description |
| ------------ | ---------------------- | ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         | `ButtonType`           | no       | `"default"` | Button type. Allowed values: `"primary"` \| `"default"` \| `"dashed"` \| `"ghost"` \| `"link"` \| `"text"` \| `"icon"` \| `"ai"` \| `"ai-alt"` \| `"neutral"` \| `"flat"` |
| size         | `ComponentSize`        | no       | `"medium"`  | Button size. Allowed values: `"large"` \| `"medium"` \| `"small"` \| `"xs"` |
| icon         | `GeneralIconProps`     | no       | -           | Icon |
| shape        | `Shape`                | no       | -           | Button shape. Circle and ellipse are supported; square when not set. Allowed values: `"round"` \| `"circle"` |
| danger       | `boolean`              | no       | `false`     | Whether to enable the danger state |
| disabled     | `boolean`              | no       | `false`     | Whether it is disabled |
| url          | `string`               | no       | -           | Link address |
| href         | `string`               | no       | -           | External link address to navigate to |
| target       | `string`               | no       | -           | Link type |
| tooltip      | `string`               | no       | -           | Tooltip text displayed on mouse hover |
| buttonStyle  | `React.CSSProperties`  | no       | -           | Button style |
| themeVariant | `"default" \| "elevo"` | no       | -           | Theme variant |

## Events

This brick has no custom events; native DOM events (such as `click`) work as usual.

## Slots

| name         | description  |
| -------- | -------- |
| (default)    | Button content |

## CSS Parts

| name   | description     |
| ------ | -------- |
| button | The button element |

## Examples

### Types

Displays all button types: primary, default, dashed, ghost, icon, text, link, ai and ai-alt.

```yaml preview gap
- brick: eo-button
  properties:
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    textContent: Default
- brick: eo-button
  properties:
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    type: icon
    icon:
      lib: antd
      icon: edit
- brick: eo-button
  properties:
    type: text
    textContent: Text
- brick: eo-button
  properties:
    type: link
    textContent: Link
- brick: eo-button
  properties:
    type: ai
    textContent: ai
- brick: eo-button
  properties:
    type: ai-alt
    size: large
    icon:
      lib: lucide
      icon: sparkles
      fill: true
      strokeWidth: 1.5
    textContent: ai-alt
```

### Sizes

Displays the four supported sizes: large, medium (default), small and xs.

```yaml preview gap
- brick: eo-button
  properties:
    size: large
    textContent: Large
- brick: eo-button
  properties:
    textContent: Medium
- brick: eo-button
  properties:
    size: small
    textContent: Small
- brick: eo-button
  properties:
    size: xs
    textContent: X-small
```

### Shapes

Displays the two shapes: square (default) and circle.

```yaml preview gap
- brick: eo-button
  properties:
    textContent: Square
- brick: eo-button
  properties:
    shape: circle
    textContent: X
```

### Danger

Displays each button type in the danger state.

```yaml preview gap
- brick: eo-button
  properties:
    danger: true
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    danger: true
    textContent: Default
- brick: eo-button
  properties:
    danger: true
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    danger: true
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    danger: true
    type: text
    textContent: Text
- brick: eo-button
  properties:
    danger: true
    type: link
    textContent: Link
```

### Disabled

Displays each button type in the disabled state; a disabled button cannot be clicked and shows a not-allowed cursor.

```yaml preview gap
- brick: eo-button
  properties:
    disabled: true
    type: primary
    textContent: Primary
- brick: eo-button
  properties:
    disabled: true
    textContent: Default
- brick: eo-button
  properties:
    disabled: true
    type: dashed
    textContent: Dashed
- brick: eo-button
  properties:
    disabled: true
    type: ghost
    textContent: Ghost
- brick: eo-button
  properties:
    disabled: true
    type: text
    textContent: Text
- brick: eo-button
  properties:
    disabled: true
    type: link
    textContent: Link
- brick: eo-button
  properties:
    disabled: true
    danger: true
    textContent: Danger
- brick: eo-button
  properties:
    disabled: true
    danger: true
    type: primary
    textContent: Danger primary
```

### Tooltip

Use the `tooltip` property to add a hover tooltip to the button; the tooltip also works for disabled buttons.

```yaml preview gap minHeight="130px"
- brick: eo-button
  properties:
    type: primary
    tooltip: primary
    textContent: Primary
- brick: eo-button
  properties:
    type: link
    tooltip: link
    textContent: Link
- brick: eo-button
  properties:
    disabled: true
    tooltip: disabled
    textContent: Default
```

### Icons

Add an icon with the `icon` property; it can be combined with text or used as an icon-only button.

```yaml preview gap
- brick: eo-flex-layout
  properties:
    gap: 8px
  children:
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: bell
        textContent: Alarm
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
        type: primary
    - brick: eo-button
      properties:
        icon:
          lib: antd
          icon: setting
          theme: filled
        shape: circle
```

### Click

Native `click` event triggered when the button is clicked; an event handler can be bound to it.

```yaml preview
- brick: eo-button
  properties:
    textContent: Click me
  events:
    click:
      action: message.success
      args:
        - Well done!
```

### Links

Use the `href` or `url` property to make the button navigate; `target` controls how it opens.

```yaml preview
- brick: eo-button
  properties:
    type: link
    href: https://baidu.com/
    target: _blank
    textContent: Link to Baidu
```

### Custom Style

Use the `buttonStyle` property to customize the inline style of the button.

```yaml preview
- brick: eo-button
  properties:
    type: primary
    textContent: Custom Style
    buttonStyle:
      borderRadius: 20px
      padding: 0 24px
```

### Theme Variant

Switch the theme variant with `themeVariant`; the `elevo` variant is for the Elevo theme.

```yaml preview gap
- brick: eo-button
  properties:
    type: primary
    textContent: Default Theme
- brick: eo-button
  properties:
    type: primary
    themeVariant: elevo
    textContent: Elevo Theme
```
