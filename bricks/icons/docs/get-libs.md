获取图标库信息。

## Examples

```yaml preview
brick: basic.general-button
properties:
  textContent: Get icon libs
events:
  click:
    useProvider: icons.get-libs
    callback:
      success:
        action: console.log
        args:
          - "Icon libs:"
          - "<% EVENT.detail %>"
```
