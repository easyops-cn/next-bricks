---
tagName: eo-sidebar-menu-group
displayName: WrappedEoSidebarMenuGroup
description: Sidebar menu group. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: navigation
source: "@next-bricks/basic"
deprecated: true
---

# eo-sidebar-menu-group

> Sidebar menu group. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated**: This brick has been migrated to the `nav` brick package; please use the new sidebar menu brick instead.

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| collapsable | `boolean` | yes | `true` | Whether collapsing is allowed |
| collapsed | `boolean` | no | - | Whether it is collapsed |
| selected | `boolean` | no | - | Whether it is selected |
| menuCollapsed | `boolean` | no | - | Whether the whole menu is collapsed |

## Slots

| name | description |
| --- | --- |
| title | Group title |

## Examples

### Basic

Shows a collapsible menu group; the group title is set via the `title` slot.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-group
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: Resource Management
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: database
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: Hosts
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: cloud
                selected: true
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: Cloud Hosts
```

### Non-collapsable

Sets `collapsable` to `false` to prevent the group from collapsing.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-group
      properties:
        collapsable: false
        selected: true
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: Fixed Group
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: file
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: Document Management
```

### Pre-collapsed

Sets `collapsed` to `true` so that the group is collapsed by default.

```yaml preview
- brick: eo-sidebar-menu
  children:
    - brick: eo-sidebar-menu-group
      properties:
        collapsed: true
      slots:
        title:
          bricks:
            - brick: span
              properties:
                textContent: Advanced Settings
        "":
          bricks:
            - brick: eo-sidebar-menu-item
              properties:
                icon:
                  lib: antd
                  icon: tool
              slots:
                "":
                  bricks:
                    - brick: span
                      properties:
                        textContent: Advanced Configuration
```
