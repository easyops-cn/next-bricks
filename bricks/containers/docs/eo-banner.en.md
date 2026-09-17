---
tagName: eo-banner
displayName: WrappedEoBanner
description: Brick `eo-banner`
category: container-layout
source: "@next-bricks/containers"
---

# eo-banner

> Brick `eo-banner`

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| bannerTitle | `string` | - | - | Banner title, displayed in the top area of the banner |
| bannerDescription | `string` | - | - | Banner description, displayed below the title |
| narrow | `NarrowViewSize` | - | `"full"` | Sets the narrow layout mode (centered). "full": full size (not centered in a narrow layout); "small": small narrow layout; "medium": medium narrow layout; "large": large narrow layout |

## Slots

| name | description |
| --- | --- |
| _(default)_ | Content area |

## Examples

### Basic

Shows a basic banner with a title and description.

```yaml preview
brick: eo-banner
properties:
  bannerTitle: Hello World
  bannerDescription: Say hello to everyone!
```

### Narrow Layout

Shows the banner in different narrow layout modes.

```yaml preview
brick: eo-banner
properties:
  bannerTitle: Narrow layout banner
  bannerDescription: Uses the medium narrow layout mode to center the content
  narrow: medium
```

### With Slot Content

Shows the banner with custom content placed in the default slot.

```yaml preview
brick: eo-banner
properties:
  bannerTitle: Banner with content
  bannerDescription: Custom content can be placed below the banner
  narrow: large
children:
  - brick: eo-button
    properties:
      textContent: Learn More
```
