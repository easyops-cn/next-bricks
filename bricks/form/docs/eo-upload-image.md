上传图片构件

## Examples

### Basic

```yaml preview
- brick: eo-upload-image
  events:
    change:
      action: console.log
      args:
        - "<% EVENT.detail %>"
```

### With Form

```yaml preview
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-upload-image
      properties:
        label: 文件
        name: file
        required: true
      events:
        change:
          - action: console.log
            args:
              - <% EVENT.detail %>
    - brick: eo-submit-buttons
```
