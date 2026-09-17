---
tagName: eo-sidebar
displayName: WrappedEoSidebar
description: Sidebar. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: navigation
source: "@next-bricks/basic"
---

# eo-sidebar

> Sidebar. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated**: This brick has been migrated to the `nav` brick package and will no longer be updated in the `basic` brick package.

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| menu | `SidebarMenuType` | yes | - | Menu data |
| expandedState | `ExpandedState \| undefined` | no | - | Sidebar state |
| hiddenFixedIcon | `boolean \| undefined` | no | - | Whether to hide the pin button |
| position | `"static" \| "fixed" \| undefined` | no | `"fixed"` | Sets the positioning mode: static or fixed. |

## Events

| event | detail | description |
| --- | --- | --- |
| actual.width.change | `number` — current width | Triggered when the width changes |
| expanded.state.change | `ExpandedState` — sidebar state | Triggered when the sidebar state changes |

## Examples

### Basic

Displays a basic sidebar, including menu data and expanded/collapsed state control.

```yaml preview minHeight="300px"
brick: eo-sidebar
properties:
  menu:
    title: My Application
    menuItems:
      - text: Overview
        to: /overview
        key: overview
      - text: Resources
        key: resources
        items:
          - text: Hosts
            to: /host
            key: resources.host
          - text: Databases
            to: /database
            key: resources.database
      - text: Settings
        to: /settings
        key: settings
events:
  actual.width.change:
    - action: console.log
  expanded.state.change:
    - action: console.log
```

### Static Position

Sets position to static so that the sidebar uses static positioning.

```yaml preview minHeight="300px"
brick: eo-sidebar
properties:
  position: static
  hiddenFixedIcon: false
  expandedState: expanded
  menu:
    title: My Application
    menuItems:
      - text: Overview
        to: /overview
        key: overview
      - text: Resources
        key: resources
        items:
          - text: Hosts
            to: /host
            key: resources.host
          - text: Databases
            to: /database
            key: resources.database
```
