构件 `visual-builder.property-editor`

## Examples

### Basic

```yaml preview
- brick: visual-builder.property-editor
  properties:
    id: editor
    editorName: eo-button-editor
  events:
    validate.success:
      - action: console.log
    validate.error:
      - action: console.log
- brick: eo-button
  properties:
    textContent: Submit
  events:
    click:
      - target: "#editor"
        method: validate
```
