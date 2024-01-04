构件 `diagram.editable-label`

## Examples

### Basic

```yaml preview
brick: diagram.editable-label
properties:
  type: line
  label: Relation
events:
  label.change:
    action: message.success
    args:
      - "<% `Label changed to: ${EVENT.detail}` %>"
```
