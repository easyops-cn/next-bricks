---
tagName: eo-easyops-avatar
displayName: WrappedEoEasyopsAvatar
description: EasyOps avatar
category: display-component
source: "@next-bricks/basic"
---

# eo-easyops-avatar

> EasyOps avatar

## Props

| property         | type                         | required | default    | description                              |
| ---------------- | ---------------------------- | -------- | ---------- | ---------------------------------------- |
| nameOrInstanceId | `string \| undefined`        | no       | -          | User name or instanceId                  |
| size             | `AvatarSize`                 | yes      | `"medium"` | Size                                     |
| gapSize          | `AvatarGapSize \| undefined` | no       | `"medium"` | Gap size between the avatar and the name |
| bordered         | `boolean \| undefined`       | no       | -          | Whether it has a border                  |
| showName         | `boolean \| undefined`       | no       | -          | Whether to show the user name            |

## CSS Parts

| name        | description                                 |
| ----------- | ------------------------------------------- |
| eo-avatar   | The eo-avatar element                       |
| avatar      | Avatar container                            |
| avatar-img  | Avatar container when displayed as an image |
| avatar-icon | Avatar container when displayed as an icon  |
| avatar-text | Avatar container when displayed as text     |
| name        | User name                                   |

## Examples

### Basic

Displays a basic EasyOps avatar; the user avatar information is loaded automatically from the user name or instanceId.

```yaml preview gap
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops1
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops_invalid
```

### Show Name

Displays the avatar together with the user name.

```yaml preview gap
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
    showName: true
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops1
    showName: true
```

### Size

Displays avatars in different sizes.

```yaml preview gap
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
    size: small
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
    size: medium
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
    size: large
```

### Bordered & Gap Size

Displays avatars with a border and customizes the gap size between the avatar and the name.

```yaml preview gap
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
    bordered: true
    showName: true
    gapSize: small
- brick: eo-easyops-avatar
  properties:
    nameOrInstanceId: easyops
    bordered: true
    showName: true
    gapSize: large
```
