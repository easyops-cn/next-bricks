上传图片构件

## Examples

### Basic

```yaml preview
- brick: form.upload-image
  events:
    change:
      action: console.log
      args:
        - "<% EVENT.detail %>"
```
