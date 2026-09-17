---
tagName: eo-frame-breadcrumb
displayName: WrappedEoFrameBreadcrumb
description: Breadcrumb. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.
category: layout-component
source: "@next-bricks/basic"
---

# eo-frame-breadcrumb

> Breadcrumb. Migrated to the `nav` brick package; it will no longer be updated in the `basic` brick package.

> **Deprecated:** This brick has been migrated to the `nav` brick package; please use the breadcrumb brick in the `nav` package instead.

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| breadcrumb | `BreadcrumbItemConf[] \| undefined` | no | - | Breadcrumb configuration |
| noCurrentApp | `boolean \| undefined` | no | - | Whether to hide the current app name |
| menu | `Menu \| undefined` | no | - | Menu configuration |

## Examples

### Basic

Shows a basic breadcrumb; the breadcrumb path is built automatically from the current app and the navigation configuration.

```yaml preview
brick: eo-frame-breadcrumb
properties: {}
```

### Custom Breadcrumb

A custom breadcrumb path that overrides the breadcrumb items read from the navigation configuration by default.

```yaml preview
brick: eo-frame-breadcrumb
properties:
  breadcrumb:
    - text: Home
      to: /
    - text: Resource Management
      to: /resource
    - text: Host List
```

### Hide Current App

Hides the current app name and shows only the custom breadcrumb path.

```yaml preview
brick: eo-frame-breadcrumb
properties:
  noCurrentApp: true
  breadcrumb:
    - text: Home
      to: /
    - text: Host List
```

### With Menu

Configures the menu item; when the app enables useCurrentMenuTitle, the current menu title is displayed in the breadcrumb.

```yaml preview
brick: eo-frame-breadcrumb
properties:
  menu:
    title: Host Management
    icon:
      lib: antd
      icon: desktop
      theme: outlined
    link: /host
  breadcrumb:
    - text: Home
      to: /
```
