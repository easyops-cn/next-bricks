---
tagName: eo-menu-item-sub-menu
displayName: WrappedEoMenuItemSubMenu
description: Menu sub-menu brick; clicking the title collapses or expands the sub-menu content
category: navigation
source: "@next-bricks/basic"
---

# eo-menu-item-sub-menu

> Menu sub-menu brick; clicking the title collapses or expands the sub-menu content

## Props

| property   | type                  | required | default | description                                                                                   |
| ---------- | --------------------- | -------- | ------- | --------------------------------------------------------------------------------------------- |
| icon       | `GeneralIconProps`    | no       | -       | Icon in the title area                                                                        |
| titleStyle | `React.CSSProperties` | no       | -       | Custom style for the title area                                                               |
| bodyStyle  | `React.CSSProperties` | no       | -       | Custom style for the content area                                                             |
| collapsed  | `boolean`             | no       | `true`  | Whether it is collapsed; the sub-menu content is hidden when collapsed, collapsed by default |

## Slots

| name      | description                          |
| --------- | ------------------------------------ |
| title     | Sub-menu title content               |
| (default) | Sub-menu content, usually menu items |

## CSS Parts

| name                | description              |
| ------------------- | ------------------------ |
| sub-menu-item       | Outer container          |
| sub-menu-item-title | Sub-menu title container |
| menu-item-icon      | Title icon               |
| sub-menu-item-arrow | Collapse arrow indicator |

## Examples

### Basic

Basic usage of the sub-menu; it is collapsed by default and clicking the title expands or collapses it.

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-item-sub-menu
      properties:
        collapsed: false
      children:
        - brick: span
          slot: title
          properties:
            textContent: System Management
        - brick: eo-menu-item
          properties:
            textContent: User Management
            active: true
        - brick: eo-menu-item
          properties:
            textContent: Role Management
    - brick: eo-menu-item-sub-menu
      children:
        - brick: span
          slot: title
          properties:
            textContent: Data Center
        - brick: eo-menu-item
          properties:
            textContent: Data Source
        - brick: eo-menu-item
          properties:
            textContent: Data Set
```

### With Icons

Configure an icon for the sub-menu title; the icon is displayed before the title text.

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-item-sub-menu
      properties:
        collapsed: false
        icon:
          lib: antd
          icon: setting
      children:
        - brick: span
          slot: title
          properties:
            textContent: System Management
        - brick: eo-menu-item
          properties:
            textContent: User Management
        - brick: eo-menu-item
          properties:
            textContent: Role Management
```

### Custom Styles

Customize the title and content area styles with `titleStyle` and `bodyStyle`.

```yaml preview
- brick: eo-menu
  properties:
    mode: vertical
  children:
    - brick: eo-menu-item-sub-menu
      properties:
        collapsed: false
        titleStyle:
          fontWeight: bold
          color: "#1890ff"
        bodyStyle:
          paddingLeft: 16px
      children:
        - brick: span
          slot: title
          properties:
            textContent: Custom Style Group
        - brick: eo-menu-item
          properties:
            textContent: Sub-menu Item A
        - brick: eo-menu-item
          properties:
            textContent: Sub-menu Item B
```
