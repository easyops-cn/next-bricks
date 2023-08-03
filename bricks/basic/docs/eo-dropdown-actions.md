下拉菜单

## Examples

### Basic

```yaml preview
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
      - text: Delete
        disabled: true
        icon:
          lib: "easyops"
          category: "default"
          icon: "delete"
        event: "delete"
        tooltip: No permission
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
