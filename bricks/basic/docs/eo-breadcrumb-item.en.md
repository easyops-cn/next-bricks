---
tagName: eo-breadcrumb-item
displayName: WrappedEoBreadcrumbItem
description: A breadcrumb item brick that supports link navigation and lets you add a prefix, a suffix and a custom separator through slots
category: navigation
source: "@next-bricks/basic"
---

# eo-breadcrumb-item

> A breadcrumb item brick that supports link navigation and lets you add a prefix, a suffix and a custom separator through slots

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| href | `string` | no | - | External link address |
| url | `ExtendedLocationDescriptor` | no | - | Link address |
| target | `Target` | no | - | Link target |

## Slots

| name | description |
| --- | --- |
| (default) | Text content of the breadcrumb item |
| prefix | Prefix |
| suffix | Suffix |
| separator | Separator |

## Examples

### Basic

A basic breadcrumb item with an icon prefix.

```yaml preview
- brick: eo-breadcrumb-item
  properties:
    textContent: Event Center
  children:
    - brick: eo-icon
      slot: prefix
      properties:
        lib: easyops
        category: app
        icon: monitor-alarm-notice
        style:
          font-size: 14px
```

### Link Navigation

Uses url or href to configure link navigation.

```yaml preview
- brick: eo-breadcrumb-item
  properties:
    textContent: Home
    url:
      pathname: /
- brick: eo-breadcrumb-item
  properties:
    textContent: External Link
    href: https://www.example.com
    target: _blank
- brick: eo-breadcrumb-item
  properties:
    textContent: Current Page
```

### Prefix and Suffix Slots

Inserts content before and after the text through the prefix and suffix slots.

```yaml preview
- brick: eo-breadcrumb-item
  properties:
    textContent: Event Center
  children:
    - brick: eo-icon
      slot: prefix
      properties:
        lib: easyops
        category: app
        icon: monitor-alarm-notice
        style:
          font-size: 14px
    - brick: eo-icon
      slot: suffix
      properties:
        lib: antd
        icon: info-circle
        theme: outlined
        style:
          font-size: 12px
```
