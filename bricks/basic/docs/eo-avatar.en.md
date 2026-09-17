---
tagName: eo-avatar
displayName: WrappedEoAvatar
description: An avatar brick that supports image, icon and text display modes; when an image fails to load it automatically falls back to an icon or text, and in text mode the font size scales with the container width
category: display-component
source: "@next-bricks/basic"
---

# eo-avatar

> An avatar brick that supports image, icon and text display modes; when an image fails to load it automatically falls back to an icon or text, and in text mode the font size scales with the container width

## Props

| property | type                               | required | default    | description                               |
| -------- | ---------------------------------- | -------- | ---------- | ----------------------------------------- |
| size     | `AvatarSize`                       | no       | `"medium"` | Size                                      |
| gapSize  | `"medium" \| "large" \| undefined` | no       | -          | Gap size between the avatar and the name  |
| shape    | `"circle" \| "round-square"`       | no       | `"circle"` | Shape                                     |
| src      | `string \| undefined`              | no       | -          | Image address                             |
| alt      | `string \| undefined`              | no       | -          | Alternative text when the image cannot be displayed |
| icon     | `GeneralIconProps \| undefined`    | no       | -          | Icon                                      |
| name     | `string \| undefined`              | no       | -          | User name                                 |
| bordered | `boolean \| undefined`             | no       | -          | Whether it has a border                   |
| showName | `boolean \| undefined`             | no       | -          | Whether to show the name                  |

## CSS Parts

| name        | description                          |
| ----------- | ------------------------------------ |
| avatar      | Avatar container                     |
| avatar-img  | Avatar container when displayed as an image |
| avatar-icon | Avatar container when displayed as an icon  |
| avatar-text | Avatar container when displayed as text     |
| name        | User name                            |

## Examples

### Type

Displays the three avatar types: image, icon and text.

```yaml preview gap
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
- brick: eo-avatar
  properties:
    name: Lucy
```

### Size

Displays the four sizes: large, medium, small and xs.

```yaml preview gap
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: large
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: medium
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: small
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    size: xs
```

### Shape

Displays the two avatar shapes: circle and round square.

```yaml preview
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    shape: circle
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    shape: round-square
```

### Border and Name Display

Enables the border and name display, and sets the name gap.

```yaml preview gap
- brick: eo-avatar
  properties:
    name: Lucy
    bordered: true
    showName: true
- brick: eo-avatar
  properties:
    name: Lucy
    bordered: true
    showName: true
    gapSize: large
- brick: eo-avatar
  properties:
    src: https://images.unsplash.com/photo-1490150028299-bf57d78394e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80&crop=right
    name: Lucy
    alt: Lucy avatar
    showName: true
```
