构件 `eo-time-picker`

## Examples

### Basic

```yaml preview
- brick: eo-time-picker
  properties:
    label: time
    placeholder: 选择时间
    value: "12:30:01"
```

### 国际化

```yaml preview
- brick: eo-time-picker
- brick: div
  properties:
    style:
      display: grid
      gap: 1em
  children:
    - brick: eo-button
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

### event

```yaml preview
- brick: eo-time-picker
  events:
    change:
      action: console.log
    open:
      action: console.log
    close:
      action: console.log
  properties:
    label: time
    placeholder: 选择时间
```
