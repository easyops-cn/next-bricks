获取当前站点语言。

## Examples

```yaml preview
brick: eo-button
properties:
  textContent: '<% I18N_TEXT({ zh: "语言", "en": "Language" }) %>'
events:
  click:
    useProvider: basic.get-language
    callback:
      success:
        action: message.success
        args:
          - "<% EVENT.detail %>"
```
