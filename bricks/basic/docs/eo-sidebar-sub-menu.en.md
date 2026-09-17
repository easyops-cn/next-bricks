---
tagName: eo-sidebar-sub-menu
displayName: WrappedEoSidebarSubMenu
description: The `eo-sidebar-sub-menu` brick has been migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: navigation
source: "@next-bricks/basic"
---

# eo-sidebar-sub-menu

> The `eo-sidebar-sub-menu` brick has been migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated**: This brick has been migrated to the `nav` brick package and will no longer be updated in the `basic` brick package.

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| menu | `SidebarMenu \| undefined` | no | - | Menu item |

## Examples

### Basic

Displays a sidebar submenu, supporting simple menu items, submenu groups and menu groups.

```yaml preview minHeight="300px"
brick: eo-sidebar-sub-menu
properties:
  menu:
    title: Resource Management
    menuItems:
      - text: Hosts
        to: /host
        key: host
      - title: Network
        key: network
        items:
          - text: Switches
            to: /switch
            key: network.switch
          - text: Routers
            to: /router
            key: network.router
      - title: Storage Group
        key: storage-group
        type: group
        items:
          - text: Disks
            to: /disk
            key: storage-group.disk
          - text: Storage Pools
            to: /pool
            key: storage-group.pool
```
