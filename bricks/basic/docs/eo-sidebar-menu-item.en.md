---
tagName: eo-sidebar-menu-item
displayName: WrappedEoSidebarMenuItem
description: Sidebar menu item. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu-item

> Sidebar menu item. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated**: This brick has been migrated to the `nav` brick package; please use the new sidebar menu brick.

## Props

| property      | type                  | required | default | description                                      |
| ------------- | --------------------- | -------- | ------- | ------------------------------------------------ |
| url           | `LinkProps["url"]`    | no       | -       | The internal system address the menu item points to |
| href          | `LinkProps["href"]`   | no       | -       | The external link address the menu item points to |
| target        | `LinkProps["target"]` | no       | -       | The target in which the menu item link opens     |
| icon          | `GeneralIconProps`    | no       | -       | The menu item icon                               |
| selected      | `boolean`             | no       | -       | Whether it is selected                           |
| menuCollapsed | `boolean`             | no       | -       | Whether the whole menu is collapsed              |

## Examples

### Basic

Displays a basic menu item with an icon and text content.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: home
        selected: false
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

### With Link

Set the menu item navigation link with `url` or `href`.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: link
        url: /home
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: Internal Link
    - brick: eo-sidebar-menu-item
      properties:
        icon:
          lib: antd
          icon: global
        href: https://www.example.com
        target: _blank
      slots:
        "":
          bricks:
            - brick: span
              properties:
                textContent: External Link
```
