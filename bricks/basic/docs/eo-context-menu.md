构件 `eo-context-menu`

## Examples

### Basic

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
```
