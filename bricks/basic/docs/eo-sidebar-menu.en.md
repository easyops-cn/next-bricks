---
tagName: eo-sidebar-menu
displayName: WrappedEoSidebarMenu
description: Sidebar menu. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu

> Sidebar menu. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated**: This brick has been migrated to the `nav` brick package; please use the new sidebar menu brick instead.

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| menuCollapsed | `boolean` | no | - | Whether the whole menu is collapsed |

## Examples

### Basic

Wraps menu items with `eo-sidebar-menu` to form a complete sidebar menu.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: home
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: Home
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: setting
        selected: true
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: Settings
```

### Collapsed

Sets `menuCollapsed` to `true` to collapse the menu so that only icons are displayed.

```yaml preview
- brick: eo-sidebar-menu
  properties:
    menuCollapsed: true
  children:
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: home
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: Home
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: setting
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: Settings
```
