构件 `eo-actions`

## Examples

### Basic

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

### item draggable

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
```
