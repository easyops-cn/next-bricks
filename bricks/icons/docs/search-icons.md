获取图标库信息。

## Examples

```yaml preview
brick: eo-button
properties:
  textContent: Search icons
events:
  click:
    useProvider: icons.search-icons
    args:
      - q: bell
    callback:
      success:
        action: console.log
        args:
          - "Search result:"
          - "<% EVENT.detail %>"
```
