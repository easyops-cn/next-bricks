---
tagName: eo-menu
displayName: WrappedEoMenu
description: A menu brick that supports vertical and horizontal layouts
category: navigation
source: "@next-bricks/basic"
---

# eo-menu

> A menu brick that supports vertical and horizontal layouts

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| mode | `"vertical" \| "horizontal"` | no | `"vertical"` | Menu layout mode, supporting the vertical and horizontal modes |

## Slots

| name | description |
| --- | --- |
| (default) | Menu content |

## Examples

### Vertical Menu

Vertical menu (default mode), used for side navigation.

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-item
      properties:
        textContent: Home
        active: true
    - brick: eo-menu-item
      properties:
        textContent: About
    - brick: eo-menu-item
      properties:
        textContent: Settings
        disabled: true
```

### Horizontal Menu

Horizontal menu, used for the top navigation bar.

```yaml preview
- brick: eo-menu
  properties:
    mode: horizontal
  children:
    - brick: eo-menu-item
      properties:
        textContent: Home
        active: true
    - brick: eo-menu-item
      properties:
        textContent: Products
    - brick: eo-menu-item
      properties:
        textContent: Documentation
```
