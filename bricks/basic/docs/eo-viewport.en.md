---
tagName: eo-viewport
displayName: WrappedEoViewport
description: Sets `<meta name="viewport" />` to adapt to mobile devices.
category: layout
source: "@next-bricks/basic"
---

# eo-viewport

> Sets `<meta name="viewport" />` to adapt to mobile devices.

## Props

| property     | type     | required | default          | description                    |
| ------------ | -------- | -------- | ---------------- | ------------------------------ |
| width        | `string` | -        | `"device-width"` | Viewport width                 |
| initialScale | `number` | -        | `1`              | Initial scale ratio            |
| minimumScale | `number` | -        | `0.1`            | Minimum scale ratio            |
| maximumScale | `number` | -        | `10`             | Maximum scale ratio            |
| userScalable | `string` | -        | `"1"`            | Whether to allow user scaling  |

## Examples

### Basic

Placing the `eo-viewport` brick on a page automatically injects a viewport meta tag into `<head>` to adapt the display to mobile devices.

```yaml preview
- brick: eo-viewport
- brick: h1
  properties:
    textContent: Hello World
```

### CustomScale

Customize the scale limits, for example disabling user scaling (`userScalable: "no"`) or setting a specific initial scale ratio.

```yaml preview
- brick: eo-viewport
  properties:
    initialScale: 1
    minimumScale: 1
    maximumScale: 1
    userScalable: "no"
- brick: h1
  properties:
    textContent: Fixed Scale Page
```

### CustomWidth

Use the `width` property to customize the viewport width; suitable for scenarios that require a fixed-width layout.

```yaml preview
- brick: eo-viewport
  properties:
    width: "375"
    initialScale: 1
- brick: h1
  properties:
    textContent: Fixed Width Page
```
