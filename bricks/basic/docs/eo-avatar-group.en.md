---
tagName: eo-avatar-group
displayName: WrappedEoAvatarGroup
description: An avatar group container that displays multiple eo-avatar or eo-easyops-avatar elements in an overlapping stack, and uniformly controls the size and border of the child avatars
category: display-component
source: "@next-bricks/basic"
---

# eo-avatar-group

> An avatar group container that displays multiple eo-avatar or eo-easyops-avatar elements in an overlapping stack, and uniformly controls the size and border of the child avatars

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| size | `"large" \| "medium" \| "small" \| "xs"` | no | - | Size |

## Slots

| name | description |
| --- | --- |
| (default) | Holds eo-avatar or eo-easyops-avatar child elements |

## Examples

### Basic

The avatar group arranges multiple avatars of different types in an overlapping stack and automatically adds a border to each avatar.

```yaml preview
brick: eo-avatar-group
properties:
  size: small
children:
  - brick: eo-avatar
    properties:
      src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
      name: Lucy
  - brick: eo-avatar
    properties:
      icon:
        lib: antd
        icon: user
        theme: outlined
        color: "#167be0"
      name: Lucy
  - brick: eo-easyops-avatar
    properties:
      nameOrInstanceId: easyops
  - brick: eo-avatar
    properties:
      name: Lucy
```

### Size

Uses the size property to uniformly set the size of all avatars in the group; four sizes are supported: large, medium, small and xs.

```yaml preview
brick: eo-avatar-group
properties:
  size: large
children:
  - brick: eo-avatar
    properties:
      name: Alice
  - brick: eo-avatar
    properties:
      name: Bob
  - brick: eo-avatar
    properties:
      name: Carol
```
