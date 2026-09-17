---
tagName: eo-breadcrumb
displayName: WrappedEoBreadcrumb
description: A breadcrumb container brick that places breadcrumb items through slots and supports a custom separator
category: navigation
source: "@next-bricks/basic"
---

# eo-breadcrumb

> A breadcrumb container brick that places breadcrumb items through slots and supports a custom separator

## Slots

| name      | description                                       |
| --------- | ------------------------------------------------- |
| (default) | Breadcrumb item; the eo-breadcrumb-item brick can be used |
| separator | Separator, defaults to /                          |

## Examples

### Basic

Basic breadcrumb navigation, including an icon prefix and a custom separator.

```yaml preview
brick: eo-breadcrumb
children:
  - brick: span
    slot: separator
    properties:
      textContent: "/"
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
      - brick: span
        slot: separator
        properties:
          textContent: ">"
  - brick: eo-breadcrumb-item
    properties:
      textContent: Alert Rules
  - brick: eo-breadcrumb-item
    properties:
      textContent: Edit
```

### Slot

Use the separator slot to customize a unified separator.

```yaml preview
brick: eo-breadcrumb
children:
  - brick: span
    slot: separator
    properties:
      textContent: ">"
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
  - brick: eo-breadcrumb-item
    properties:
      textContent: Alert Rules
  - brick: eo-breadcrumb-item
    properties:
      textContent: Edit
```
