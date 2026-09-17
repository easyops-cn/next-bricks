---
tagName: eo-menu-item
displayName: WrappedEoMenuItem
description: A menu item brick that supports icon, active and disabled states
category: navigation
source: "@next-bricks/basic"
---

# eo-menu-item

> A menu item brick that supports icon, active and disabled states

## Props

| property | type               | required | default | description                                                           |
| -------- | ------------------ | -------- | ------- | --------------------------------------------------------------------- |
| icon     | `GeneralIconProps` | no       | -       | Icon                                                                  |
| active   | `boolean`          | no       | -       | Whether it is active                                                  |
| disabled | `boolean`          | no       | -       | Whether it is disabled; when disabled, click event propagation is stopped |

## Slots

| name      | description     |
| --------- | --------------- |
| (default) | Menu item content |

## CSS Parts

| name           | description     |
| -------------- | --------------- |
| menu-item      | Outer container |
| menu-item-icon | Menu item icon  |

## Examples

### Basic

Basic menu item usage, showing the normal, active and disabled states.

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

### With Icons

A menu item configured with an icon; the icon is displayed before the text.

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-item
      properties:
        textContent: Dashboard
        active: true
        icon:
          lib: antd
          icon: dashboard
    - brick: eo-menu-item
      properties:
        textContent: User Management
        icon:
          lib: antd
          icon: user
    - brick: eo-menu-item
      properties:
        textContent: System Settings
        icon:
          lib: antd
          icon: setting
        disabled: true
```
