---
tagName: eo-actions
displayName: WrappedEoActions
description: An action list brick used to display a set of clickable action menu items; supports multi-level submenus, groups, dividers, checked/active state highlighting, drag and drop, and link navigation
category: interact-basic
source: "@next-bricks/basic"
---

# eo-actions

> An action list brick used to display a set of clickable action menu items; supports multi-level submenus, groups, dividers, checked/active state highlighting, drag and drop, and link navigation

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| actions | `Action[] \| undefined` | no | - | Action list configuration |
| checkedKeys | `(string \| number)[]` | no | `[]` | Checked item configuration of actions |
| activeKeys | `(string \| number)[]` | no | `[]` | Active item configuration of actions, used for selecting and expanding menu items; the currently active menu items must be listed in order of the menu hierarchy |
| itemDraggable | `boolean \| undefined` | no | - | Whether the menu items in action are draggable |
| themeVariant | `"default" \| "elevo" \| undefined` | no | - | Theme variant, controls the visual style of the action list; `"elevo"` is the new style and `"default"` is the default style |
| footerTips | `string \| undefined` | no | - | Footer tip text |

## Events

| event | detail | description |
| --- | --- | --- |
| action.click | `SimpleAction` — the button configuration | Triggered when the button is clicked |
| item.drag.start | `SimpleAction` — the action configuration of the menu item | Triggered when dragging a menu item starts |
| item.drag.end | `SimpleAction` — the action configuration of the menu item | Triggered when dragging a menu item ends |

## Examples

### Basic

Displays a basic action menu, including icons, tooltips, dangerous actions and a submenu.

```yaml preview
brick: eo-actions
properties:
  actions:
    - text: Query
      icon:
        icon: search
        lib: antd
        theme: outlined
      event: "query"
      tooltip: some tooltip...
    - text: Edit
      icon:
        lib: "easyops"
        category: "default"
        icon: "edit"
      event: "edit"
    - type: divider
    - text: Delete
      icon:
        lib: "easyops"
        category: "default"
        icon: "delete"
      event: "delete"
      tooltip: No permission
      danger: true
    - text: Delete 2
      disabled: true
      icon:
        lib: "easyops"
        category: "default"
        icon: "delete"
      event: "delete2"
      tooltip: No permission
    - text: switch org
      icon:
        lib: "antd"
        icon: "swap"
      items:
        - text: org1
          event: "org1.click"
        - text: org2
          event: "org2.click"
events:
  query:
    action: message.success
    args:
      - click query button
  edit:
    action: message.warn
    args:
      - click edit button
  delete:
    action: message.error
    args:
      - click delete button
```

### Checked and Active States

Uses checkedKeys and activeKeys to set the checked and active states of menu items.

```yaml preview
brick: eo-actions
properties:
  checkedKeys:
    - "edit"
  activeKeys:
    - "edit"
  actions:
    - text: Query
      key: "query"
      icon:
        lib: antd
        icon: search
        theme: outlined
    - text: Edit
      key: "edit"
      icon:
        lib: easyops
        category: default
        icon: edit
    - text: Delete
      key: "delete"
      danger: true
      icon:
        lib: easyops
        category: default
        icon: delete
events:
  action.click:
    action: message.success
    args:
      - "<% EVENT.detail.text %>"
```

### Grouped Menu

Uses type: group to display menu items in groups, and footerTips to display a footer tip.

```yaml preview
brick: eo-actions
properties:
  footerTips: "4 actions in total"
  actions:
    - type: group
      text: Basic Actions
    - text: View
      icon:
        lib: antd
        icon: eye
        theme: outlined
    - text: Edit
      icon:
        lib: antd
        icon: edit
        theme: outlined
    - type: group
      text: Dangerous Actions
    - text: Delete
      danger: true
      icon:
        lib: antd
        icon: delete
        theme: outlined
```

### item draggable

Sets itemDraggable to enable dragging of menu items; use dragConf to pass drag data and listen for the item.drag.start and item.drag.end events to observe drag behavior.

```yaml preview
brick: eo-actions
properties:
  itemDraggable: true
  actions:
    - text: document
      icon:
        lib: antd
        icon: folder
      dragConf:
        format: text/plain
        data:
          category: document
          title: Document
    - text: file
      icon:
        lib: antd
        icon: file
      dragConf:
        format: text/plain
        data:
          category: file
          title: File
events:
  item.drag.start:
    action: message.info
    args:
      - "<% 'Drag start: ' + EVENT.detail.text %>"
  item.drag.end:
    action: message.info
    args:
      - "<% 'Drag end: ' + EVENT.detail.text %>"
```

### Theme Variant

Uses themeVariant to switch the visual style of the action list.

```yaml preview
brick: eo-actions
properties:
  themeVariant: "elevo"
  actions:
    - text: View
      icon:
        lib: antd
        icon: eye
        theme: outlined
    - text: Edit
      icon:
        lib: antd
        icon: edit
        theme: outlined
    - type: divider
    - text: Delete
      danger: true
      icon:
        lib: antd
        icon: delete
        theme: outlined
```
