---
tagName: eo-narrow-view
displayName: WrappedEoNarrowView
description: Narrow layout view (centered)
category: container-layout
source: "@next-bricks/containers"
---

# eo-narrow-view

> Narrow layout view (centered)

## Props

| property | type                                       | required | default    | description                                                       |
| -------- | ------------------------------------------ | -------- | ---------- | ------------------------------------------------------------------ |
| size     | `"small" \| "medium" \| "large" \| "full"` | no       | `"medium"` | Narrow layout size; controls the maximum width of the content area and its centered display |

## Slots

| name      | description  |
| --------- | ------------ |
| (default) | Content area |

## Examples

### Basic

Shows basic usage of eo-narrow-view, with the content displayed centered.

```html preview
<eo-narrow-view>Hello world</eo-narrow-view>
```

### Size

Use the `size` property to control the width of the content area; the `small`, `medium`, `large` and `full` levels are supported.

```yaml preview
- brick: eo-narrow-view
  properties:
    size: small
  children:
    - brick: div
      properties:
        textContent: Small narrow view
        style:
          background: var(--palette-blue-2)
          padding: 8px
- brick: eo-narrow-view
  properties:
    size: medium
  children:
    - brick: div
      properties:
        textContent: Medium narrow view (default)
        style:
          background: var(--palette-green-2)
          padding: 8px
- brick: eo-narrow-view
  properties:
    size: large
  children:
    - brick: div
      properties:
        textContent: Large narrow view
        style:
          background: var(--palette-orange-2)
          padding: 8px
- brick: eo-narrow-view
  properties:
    size: full
  children:
    - brick: div
      properties:
        textContent: Full size (no centering)
        style:
          background: var(--palette-red-2)
          padding: 8px
```
