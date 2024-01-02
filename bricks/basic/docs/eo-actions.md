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
