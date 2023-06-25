更改站点语言。

## Examples

```yaml preview gap
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: basic.general-button
    properties:
      textContent: 中文
    events:
      click:
        useProvider: basic.change-language
        args:
          - zh
        callback:
          success:
            action: message.success
            args:
              - '<% I18N_TEXT({ zh: "你好", "en": "Hello" }) %>'
  - brick: basic.general-button
    properties:
      textContent: English
    events:
      click:
        useProvider: basic.change-language
        args:
          - en
        callback:
          success:
            action: message.success
            args:
              - '<% I18N_TEXT({ zh: "你好", "en": "Hello" }) %>'
```
