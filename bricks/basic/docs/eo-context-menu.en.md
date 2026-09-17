---
tagName: eo-context-menu
displayName: WrappedEoContextMenu
description: A context menu brick that displays an action menu at a specified coordinate position
category: interact-basic
source: "@next-bricks/basic"
---

# eo-context-menu

> A context menu brick that displays an action menu at a specified coordinate position

## Props

| property      | type       | required | default | description                                                                    |
| ------------- | ---------- | -------- | ------- | ------------------------------------------------------------------------------ |
| actions       | `Action[]` | no       | -       | Action list                                                                    |
| active        | `boolean`  | no       | -       | Whether it is active                                                           |
| position      | `Position` | no       | -       | The coordinate position where the menu is displayed [x, y], usually set by the open method |
| itemDraggable | `boolean`  | no       | -       | Whether the menu items in action are draggable                                 |

## Events

| event           | detail                                       | description                                     |
| --------------- | -------------------------------------------- | ----------------------------------------------- |
| action.click    | `SimpleAction` — the action configuration of that menu item | Triggered when a menu item action is clicked    |
| item.drag.start | `SimpleAction` — the action configuration of that menu item | Triggered when dragging a menu item starts      |
| item.drag.end   | `SimpleAction` — the action configuration of that menu item | Triggered when dragging a menu item ends        |

## Methods

| method | params                                                                        | returns | description                            |
| ------ | ----------------------------------------------------------------------------- | ------- | -------------------------------------- |
| open   | <ul><li>`info: OpenInfo` - opening info, containing the coordinate position where the menu is displayed</li></ul> | `void` | Open the context menu at the specified position |
| close  | -                                                                             | `void` | Close the context menu                |

## Examples

### Basic

Listen for the contextmenu event on an element, call the `open` method to display the action menu at the mouse position, and click a menu item to trigger the `action.click` event.

```yaml preview minHeight="200px"
- brick: button
  properties:
    textContent: Right-click Me
  events:
    contextmenu:
      - action: event.preventDefault
      - target: eo-context-menu
        method: open
        args:
          - position: <% [EVENT.clientX, EVENT.clientY] %>
- brick: eo-context-menu
  properties:
    actions:
      - text: Edit
        icon:
          lib: antd
          icon: edit
      - type: divider
      - text: Delete
        icon:
          lib: antd
          icon: delete
  events:
    action.click:
      action: message.success
      args:
        - '<% "Clicked: " + EVENT.detail.text %>'
```

### Draggable Actions

Enabling the `itemDraggable` property allows menu items to be dragged; the corresponding events are triggered when dragging starts and ends.

```yaml preview minHeight="200px"
- brick: button
  properties:
    textContent: Right-click Me
  events:
    contextmenu:
      - action: event.preventDefault
      - target: eo-context-menu
        method: open
        args:
          - position: <% [EVENT.clientX, EVENT.clientY] %>
- brick: eo-context-menu
  properties:
    itemDraggable: true
    actions:
      - text: Drag me
        key: drag1
        icon:
          lib: antd
          icon: drag
        dragConf:
          format: text/plain
          data: item1
      - text: Draggable too
        key: drag2
        icon:
          lib: antd
          icon: drag
        dragConf:
          format: text/plain
          data: item2
  events:
    item.drag.start:
      action: message.info
      args:
        - '<% "Drag start: " + EVENT.detail.text %>'
    item.drag.end:
      action: message.success
      args:
        - '<% "Drag end: " + EVENT.detail.text %>'
```
