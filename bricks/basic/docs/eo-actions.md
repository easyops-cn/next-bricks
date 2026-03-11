---
tagName: eo-actions
displayName: WrappedEoActions
description: 操作列表构件，用于展示一组可点击的操作菜单项，支持多级子菜单、分组、分隔线、选中/激活状态高亮、拖拽及链接跳转
category: interact-basic
source: "@next-bricks/basic"
---

# eo-actions

> 操作列表构件，用于展示一组可点击的操作菜单项，支持多级子菜单、分组、分隔线、选中/激活状态高亮、拖拽及链接跳转

## Props

| 属性          | 类型                                | 必填 | 默认值 | 说明                                                                                 |
| ------------- | ----------------------------------- | ---- | ------ | ------------------------------------------------------------------------------------ |
| actions       | `Action[] \| undefined`             | 否   | -      | 操作列表配置                                                                         |
| checkedKeys   | `(string \| number)[]`              | 否   | `[]`   | actions 选中项配置                                                                   |
| activeKeys    | `(string \| number)[]`              | 否   | `[]`   | actions 激活项配置，用于菜单项的选择和展开，需按菜单层级顺序依次列出当前激活的菜单项 |
| itemDraggable | `boolean \| undefined`              | 否   | -      | action中的菜单项是否可拖拽                                                           |
| themeVariant  | `"default" \| "elevo" \| undefined` | 否   | -      | 主题变体，控制操作列表的视觉风格，"elevo" 为新风格，"default" 为默认风格             |
| footerTips    | `string \| undefined`               | 否   | -      | 底部提示文字                                                                         |

## Events

| 事件            | detail                            | 说明                 |
| --------------- | --------------------------------- | -------------------- |
| action.click    | `SimpleAction` — 该按钮配置       | 点击按钮时触发       |
| item.drag.start | `SimpleAction` — 该菜单项动作配置 | 开始拖拽菜单项时触发 |
| item.drag.end   | `SimpleAction` — 该菜单项动作配置 | 完成拖拽菜单项时触发 |

## Examples

### Basic

展示基本操作菜单，包含图标、tooltip、危险操作和子菜单。

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

### 选中与激活状态

使用 checkedKeys 和 activeKeys 设置菜单项的选中与激活状态。

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

### 分组菜单

使用 type: group 对菜单项进行分组展示，使用 footerTips 展示底部提示。

```yaml preview
brick: eo-actions
properties:
  footerTips: "共 4 个操作"
  actions:
    - type: group
      text: 基础操作
    - text: 查看
      icon:
        lib: antd
        icon: eye
        theme: outlined
    - text: 编辑
      icon:
        lib: antd
        icon: edit
        theme: outlined
    - type: group
      text: 危险操作
    - text: 删除
      danger: true
      icon:
        lib: antd
        icon: delete
        theme: outlined
```

### item draggable

设置 itemDraggable 启用菜单项拖拽，配合 dragConf 传递拖拽数据，通过 item.drag.start 和 item.drag.end 事件监听拖拽行为。

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
          title: 文档
    - text: file
      icon:
        lib: antd
        icon: file
      dragConf:
        format: text/plain
        data:
          category: file
          title: 文件
events:
  item.drag.start:
    action: message.info
    args:
      - "<% '开始拖拽: ' + EVENT.detail.text %>"
  item.drag.end:
    action: message.info
    args:
      - "<% '结束拖拽: ' + EVENT.detail.text %>"
```

### 主题变体

使用 themeVariant 切换操作列表的视觉风格。

```yaml preview
brick: eo-actions
properties:
  themeVariant: "elevo"
  actions:
    - text: 查看
      icon:
        lib: antd
        icon: eye
        theme: outlined
    - text: 编辑
      icon:
        lib: antd
        icon: edit
        theme: outlined
    - type: divider
    - text: 删除
      danger: true
      icon:
        lib: antd
        icon: delete
        theme: outlined
```
