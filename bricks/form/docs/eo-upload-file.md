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
