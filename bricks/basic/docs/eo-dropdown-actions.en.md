---
tagName: eo-dropdown-actions
displayName: WrappedEoDropdownActions
description: A dropdown menu brick; clicking the trigger element pops up the action list, supporting checked state, popup positioning strategy configuration and custom trigger content
category: interact-basic
source: "@next-bricks/basic"
---

# eo-dropdown-actions

> A dropdown menu brick; clicking the trigger element pops up the action list, supporting checked state, popup positioning strategy configuration and custom trigger content

## Props

| property | type | required | default | description |
| --- | --- | --- | --- | --- |
| actions | `Action[]` | no | - | Action list configuration |
| checkedKeys | `(string \| number)[]` | no | `[]` | Checked item configuration of actions |
| disabled | `boolean` | no | - | Whether it is disabled |
| strategy | `"absolute" \| "fixed"` | no | `"absolute"` | How the popup is positioned |
| placement | `Placement` | no | `"bottom-start"` | Placement of the popup |
| themeVariant | `"default" \| "elevo"` | no | - | Theme variant |

## Events

| event | detail | description |
| --- | --- | --- |
| action.click | `SimpleAction` — the button configuration | Triggered when the button is clicked |
| visible.change | `boolean` — whether it is currently visible | Triggered after the popup visibility changes |

## Slots

| name | description |
| --- | --- |
| _(default)_ | Anchor element that triggers the popup |

## Examples

### Basic

Displays a dropdown action menu containing icons, a divider, dangerous items and a submenu; the default slot holds the trigger button.

```yaml preview minHeight="240px"
- brick: eo-dropdown-actions
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
      - action: message.success
        args:
          - click query button
    edit:
      - action: message.warn
        args:
          - click edit button
    delete:
      - action: message.error
        args:
          - click delete button
  children:
    - brick: eo-button
      properties:
        textContent: button
```

### Checked Keys

Uses `checkedKeys` to configure the checked menu items.

```yaml preview minHeight="200px"
- brick: eo-dropdown-actions
  properties:
    checkedKeys:
      - edit
    actions:
      - text: Edit
        key: edit
        icon:
          lib: antd
          icon: edit
      - text: Delete
        key: delete
        icon:
          lib: antd
          icon: delete
        danger: true
  events:
    action.click:
      action: message.success
      args:
        - <% EVENT.detail.text %>
  children:
    - brick: eo-button
      properties:
        textContent: Actions
```

### Disabled

Disables the dropdown menu so that users cannot open the action list.

```yaml preview
- brick: eo-dropdown-actions
  properties:
    disabled: true
    actions:
      - text: Edit
        icon:
          lib: antd
          icon: edit
      - text: Delete
        icon:
          lib: antd
          icon: delete
        danger: true
  children:
    - brick: eo-button
      properties:
        disabled: true
        textContent: Disabled
```

### Visible Change

Listens for the `visible.change` event and configures the popup positioning and theme through `placement`, `strategy` and `themeVariant`.

```yaml preview minHeight="200px"
- brick: eo-dropdown-actions
  properties:
    placement: bottom-start
    strategy: fixed
    themeVariant: default
    actions:
      - text: Option 1
        icon:
          lib: antd
          icon: check
      - text: Option 2
        icon:
          lib: antd
          icon: star
  events:
    visible.change:
      action: message.info
      args:
        - '<% EVENT.detail ? "Menu opened" : "Menu closed" %>'
  children:
    - brick: eo-button
      properties:
        textContent: Open Menu
```
