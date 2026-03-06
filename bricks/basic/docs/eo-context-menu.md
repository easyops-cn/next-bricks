---
tagName: eo-context-menu
displayName: WrappedEoContextMenu
description: 右键菜单构件，在指定坐标位置展示操作菜单
category: interact-basic
source: "@next-bricks/basic"
---

# eo-context-menu

> 右键菜单构件，在指定坐标位置展示操作菜单

## Props

| 属性          | 类型       | 必填 | 默认值 | 说明                                            |
| ------------- | ---------- | ---- | ------ | ----------------------------------------------- |
| actions       | `Action[]` | 否   | -      | 动作列表                                        |
| active        | `boolean`  | 否   | -      | 是否激活                                        |
| position      | `Position` | 否   | -      | 菜单显示的位置坐标 [x, y]，通常由 open 方法设置 |
| itemDraggable | `boolean`  | 否   | -      | action中的菜单项是否可拖拽                      |

## Events

| 事件            | detail                            | 说明                 |
| --------------- | --------------------------------- | -------------------- |
| action.click    | `SimpleAction` — 该菜单项动作配置 | 点击菜单项动作时触发 |
| item.drag.start | `SimpleAction` — 该菜单项动作配置 | 开始拖拽菜单项时触发 |
| item.drag.end   | `SimpleAction` — 该菜单项动作配置 | 完成拖拽菜单项时触发 |

## Methods

| 方法  | 参数                                                                  | 返回值 | 说明                   |
| ----- | --------------------------------------------------------------------- | ------ | ---------------------- |
| open  | <ul><li>`info: OpenInfo` - 打开信息，包含菜单显示的坐标位置</li></ul> | `void` | 在指定位置打开右键菜单 |
| close | -                                                                     | `void` | 关闭右键菜单           |

## Examples

### Basic

在元素上监听右键事件，调用 `open` 方法在鼠标位置展示操作菜单，点击菜单项触发 `action.click` 事件。

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

启用 `itemDraggable` 属性允许拖拽菜单项，拖拽开始和结束时分别触发对应事件。

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
      - text: 拖拽我
        key: drag1
        icon:
          lib: antd
          icon: drag
        dragConf:
          format: text/plain
          data: item1
      - text: 也可拖拽
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
        - '<% "开始拖拽: " + EVENT.detail.text %>'
    item.drag.end:
      action: message.success
      args:
        - '<% "完成拖拽: " + EVENT.detail.text %>'
```
