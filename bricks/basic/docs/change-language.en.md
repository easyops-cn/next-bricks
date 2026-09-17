Changes the site language.

## Examples

```yaml preview gap
brick: div
properties:
  style:
    display: grid
    gap: 1em
children:
  - brick: eo-button
    properties:
      textContent: Chinese
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
  - brick: eo-button
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
