---
tagName: eo-sidebar-menu-submenu
displayName: WrappedEoSidebarMenuSubmenu
description: Sidebar menu submenu. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu-submenu

> Sidebar menu submenu. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated**: This brick has been migrated to the `nav` brick package; please use the new sidebar menu brick.

## Props

| property      | type               | required | default | description                        |
| ------------- | ------------------ | -------- | ------- | ---------------------------------- |
| icon          | `GeneralIconProps` | no       | -       | The menu icon                      |
| selected      | `boolean`          | no       | -       | Whether it is selected             |
| collapsed     | `boolean`          | no       | -       | Whether it is collapsed            |
| menuCollapsed | `boolean`          | no       | -       | Whether the whole menu is collapsed |

## Slots

| name  | description    |
| ----- | -------------- |
| title | Submenu title  |

## Examples

### Basic

Displays a collapsible submenu, including the title slot and the submenu items.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-submenu
      properties:
        icon:
          lib: antd
          icon: folder
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: App Management
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: appstore
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: App List
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: plus
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: New App
```

### Collapsed

Set `collapsed` to `true` to collapse the submenu by default.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-submenu
      properties:
        icon:
          lib: antd
          icon: folder
        collapsed: true
        selected: true
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: System Management
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: user
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: User Management
```
