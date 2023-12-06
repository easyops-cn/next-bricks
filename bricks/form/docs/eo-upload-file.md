上传文件

## Examples

### Basic

```yaml preview
brick: eo-upload-file
properties:
  style:
    width: 300px
  uploadDraggable: true
  maxCount: 2
  multiple: true
  accept: image/*
  draggableUploadTip: 支持上传图片
events:
  change:
    - action: console.log
      args:
        - <% EVENT.detail %>
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
    - brick: eo-upload-file
      properties:
        label: 文件
        name: file
        required: true
        style:
          width: 300px
        uploadDraggable: true
        maxCount: 2
        multiple: true
        accept: image/*
        draggableUploadTip: 支持上传图片
      events:
        change:
          - action: console.log
            args:
              - <% EVENT.detail %>
    - brick: eo-submit-buttons
```
