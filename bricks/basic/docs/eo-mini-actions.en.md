---
tagName: eo-mini-actions
displayName: WrappedEoMiniActions
description: A group of small buttons
category: interact-basic
source: "@next-bricks/basic"
---

# eo-mini-actions

> A group of small buttons

## Props

| property     | type                                | required | default | description             |
| ------------ | ----------------------------------- | -------- | ------- | ----------------------- |
| actions      | `ActionType[] \| undefined`         | no       | -       | Action list config      |
| themeVariant | `"default" \| "elevo" \| undefined` | no       | -       | Theme variant           |

## Events

| event          | detail                              | description                                                   |
| -------------- | ----------------------------------- | ------------------------------------------------------------- |
| action.click   | `SimpleActionType` — the button config | Triggered when the button is clicked                       |
| visible.change | `boolean` — whether it is currently visible | Triggered after the visibility of the dropdown menu changes |

## Examples

### Basic

Demonstrates a basic group of small buttons, including a plain icon button and dropdown menu buttons.

```yaml preview minHeight="160px"
brick: eo-mini-actions
properties:
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: star
      isDropdown: false
      event: collect
    - icon:
        lib: antd
        icon: copy
        theme: outlined
      text: Copy Link
      isDropdown: true
      event: copy
    - icon:
        lib: antd
        icon: download
        theme: outlined
      text: Download
      isDropdown: true
      disabled: true
      event: download
events:
  action.click:
    - action: console.log
  visible.change:
    - action: console.log
```

### Theme Variant

Demonstrates a group of small buttons using the elevo theme variant.

```yaml preview minHeight="160px"
brick: eo-mini-actions
properties:
  themeVariant: elevo
  actions:
    - icon:
        lib: antd
        theme: outlined
        icon: edit
      isDropdown: false
      event: edit
      tooltip: Edit
    - icon:
        lib: antd
        icon: delete
        theme: outlined
      text: Delete
      isDropdown: true
      danger: true
      event: delete
    - icon:
        lib: antd
        icon: share-alt
        theme: outlined
      text: Share
      isDropdown: true
      event: share
events:
  action.click:
    - action: console.log
```
