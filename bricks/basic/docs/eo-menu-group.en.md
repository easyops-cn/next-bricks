---
tagName: eo-menu-group
displayName: WrappedEoMenuGroup
description: A menu group brick used to display menu items in groups, providing a title slot and a content slot
category: navigation
source: "@next-bricks/basic"
---

# eo-menu-group

> A menu group brick used to display menu items in groups, providing a title slot and a content slot

## Slots

| name      | description                          |
| --------- | ------------------------------------ |
| title     | Group title content                  |
| (default) | Group content, usually menu items    |

## CSS Parts

| name             | description          |
| ---------------- | -------------------- |
| menu-group       | Outer container      |
| menu-group-title | Group title container |

## Examples

### Basic

Basic usage of a menu group, setting the group title through the `title` slot.

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-group
      children:
        - brick: span
          properties:
            textContent: System Management
          slot: title
        - brick: eo-menu-item
          properties:
            textContent: User Management
        - brick: eo-menu-item
          properties:
            textContent: Role Management
    - brick: eo-menu-group
      children:
        - brick: span
          properties:
            textContent: Data Center
          slot: title
        - brick: eo-menu-item
          properties:
            textContent: Data Source
        - brick: eo-menu-item
          properties:
            textContent: Data Set
```
