---
tagName: eo-dropdown-button
displayName: WrappedEoDropdownButton
description: Dropdown button brick that combines a button with a dropdown action list; clicking the button opens the action menu, and the button text, icon, size and shape can be customized
category: interact-basic
source: "@next-bricks/basic"
---

# eo-dropdown-button

> Dropdown button brick that combines a button with a dropdown action list; clicking the button opens the action menu, and the button text, icon, size and shape can be customized

## Props

| property | type                                 | required | default                                             | description                    |
| -------- | ------------------------------------ | -------- | --------------------------------------------------- | ------------------------------ |
| type     | `ButtonType \| undefined`            | no       | -                                                   | Button type                    |
| actions  | `Action[] \| undefined`              | no       | -                                                   | Dropdown button menu           |
| btnText  | `string \| undefined`                | no       | `"Manage"`                                          | Default button text            |
| icon     | `GeneralIconProps \| undefined`      | no       | `{ lib: "antd", icon: "setting", theme: "filled" }` | Default button icon            |
| size     | `ComponentSize`                      | yes      | `"medium"`                                          | Button size                    |
| disabled | `boolean \| undefined`               | no       | -                                                   | Whether it is disabled         |
| shape    | `Shape \| undefined`                 | no       | -                                                   | Button shape                   |
| strategy | `"absolute" \| "fixed" \| undefined` | no       | `"absolute"`                                        | How the popup layer is positioned |

## Events

| event        | detail                                                                                                                                                                                                                                              | description          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| action.click | `SimpleAction` — { key: key of the action item, text: text of the action item, event: custom event name, icon: icon config, disabled: whether it is disabled, hidden: whether it is hidden, tooltip: tooltip text, url: link address, href: external link, target: link target, danger: whether it is a danger action, dragConf: drag config } | Action click event   |

## Examples

### Basic

Basic usage of the general-purpose dropdown button; displays a list of menu items.

```yaml preview minHeight="160px"
brick: eo-dropdown-button
properties:
  actions:
    - text: Item 1
    - text: Item 2
```

### Type

Demonstrates the dropdown button with different button types.

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    type: primary
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    type: dashed
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    type: text
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    type: link
    actions:
      - text: Item 1
      - text: Item 2
```

### Button Text & Icon

A dropdown button with custom button text and icon.

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    btnText: Dropdown Button
    icon:
      icon: search
      lib: antd
      theme: outlined
    actions:
      - text: Item 1
      - text: Item 2
```

### Size

Demonstrates dropdown buttons in different sizes.

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    size: large
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    size: medium
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    size: small
    actions:
      - text: Item 1
      - text: Item 2
```

### Disabled

Demonstrates disabled dropdown buttons, including disabling the whole button and disabling a single menu item.

```yaml preview minHeight="160px"
- brick: eo-dropdown-button
  properties:
    disabled: true
    actions:
      - text: Item 1
      - text: Item 2
- brick: eo-dropdown-button
  properties:
    btnText: ""
    shape: circle
    icon:
      icon: setting
      lib: antd
      theme: filled
    actions:
      - text: Item 1
        disabled: true
      - text: Item 2
```

### Actions & Event

Demonstrates menu items with icons and listens to the click event, handling different actions through the `action.click` event.

```yaml preview minHeight="200px"
- brick: eo-dropdown-button
  properties:
    strategy: fixed
    icon:
      icon: search
      lib: antd
      theme: outlined
    actions:
      - text: Query
        icon:
          icon: search
          lib: antd
          theme: outlined
        event: "query"
      - text: Edit
        icon:
          lib: "easyops"
          category: "default"
          icon: "edit"
        event: "edit"
      - text: Delete
        icon:
          lib: "easyops"
          category: "default"
          icon: "delete"
        event: "delete"
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
```
