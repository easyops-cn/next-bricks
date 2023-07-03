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
