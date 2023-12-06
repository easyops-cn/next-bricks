构件 `eo-date-picker`

## Examples

### Basic

```yaml preview minHeight="450px"
- brick: eo-date-picker
```

### picker

```yaml preview minHeight="550px"
- brick: eo-radio
  events:
    change:
      - target: "#datePicker"
        properties:
          picker: <% EVENT.detail.value %>
  properties:
    options:
      - label: 天
        value: date
      - label: 周
        value: week
      - label: 月
        value: month
      - label: 季度
        value: quarter
      - label: 年
        value: year
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
- brick: eo-date-picker
  properties:
    id: datePicker
    useFastSelectBtn: true
```

### showTime

```yaml preview minHeight="450px"
- brick: eo-date-picker
  events:
    ok:
      action: console.log
    change:
      action: console.log
  properties:
    showTime: true
    value: "2020-02-01 14:30:00"
    format: "YYYY-MM-DD HH:mm:ss"
```

### 禁用日期

```yaml preview minHeight="450px"
- brick: eo-date-picker
  events:
    ok:
      action: console.log
    change:
      action: console.log
  properties:
    disabledDate:
      - weekday: 4
      - date: 10-15
        year: 2010-2020
      - hour: 12-18
        minute: 0-29
        weekday: 3
    format: "YYYY-MM-DD HH:mm:ss"
    showTime: true
    value: "2019-10-01 00:00:00"
```

### With Form

```yaml preview minHeight="450px"
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-date-picker
      properties:
        label: 日期
        name: date
        required: true
    - brick: eo-submit-buttons
```
