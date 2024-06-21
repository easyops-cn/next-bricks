构件 `visual-builder.property-editor`

## Examples

### Basic

```yaml preview
- brick: eo-select
  properties:
    label: 选择一个构件
    value: eo-button
    options: <% MISC.local_editors %>
    style:
      display: block
      marginBottom: 2em
  events:
    change:
      target: "#editor"
      properties:
        editorName: <% EVENT.detail.value %>
- brick: visual-builder.property-editor
  properties:
    id: editor
    editorName: eo-button
    advancedMode: <%= CTX.isAdvanced %>
  events:
    validate.success:
      - action: console.log
    validate.error:
      - action: console.log
- brick: eo-search-bar
  context:
    - name: isAdvanced
      value: false
  children:
    - brick: eo-button
      slot: start
      properties:
        textContent: Submit
      events:
        click:
          - target: "#editor"
            method: validate
    - brick: eo-link
      slot: end
      properties:
        textContent: |
          <%= `切换到${CTX.isAdvanced ? "普通" : "高级"}模式` %>
      events:
        click:
          - action: context.replace
            args:
              - isAdvanced
              - <% !CTX.isAdvanced %>
```
