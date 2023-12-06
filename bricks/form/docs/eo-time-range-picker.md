构件 `eo-time-range-picker`

## Examples

### Basic

```yaml preview minHeight="400px"
- brick: eo-time-range-picker
  properties:
    label: hello
    name: time
```

### rangeType

```yaml preview minHeight="400px"
- brick: eo-radio
  properties:
    options:
      - time
      - date
      - dateTime
      - hmTime
      - week
      - month
      - quarter
      - year
  events:
    change:
      - target: "#rangePicker"
        properties:
          rangeType: <% EVENT.detail.value %>
- brick: eo-time-range-picker
  properties:
    label: hello
    name: time
    id: rangePicker
    rangeType: date
```

### presetRanges

```yaml preview minHeight="400px"
- brick: eo-time-range-picker
  properties:
    label: hello
    name: time
    rangeType: week
    required: true
    presetRanges:
      - 本周
      - 本月
      - 本季度
      - 今年
```

### validate

```yaml preview minHeight="400px"
- brick: eo-form
  events:
    values.change:
      - action: console.log
    validate.success:
      - action: message.success
        args:
          - 表单提交成功
    validate.error:
      - action: message.error
        args:
          - 表单校验失败
  slots:
    "":
      bricks:
        - brick: eo-time-range-picker
          events:
            change:
              action: console.log
          properties:
            label: hello
            name: time
            required: true
        - brick: eo-submit-buttons
```

### selectNearDays

```yaml preview minHeight="400px"
- brick: eo-time-range-picker
  events:
    - action: console.log
  properties:
    label: hello
    name: time
    selectNearDays: 10
    rangeType: date
```

### Events

```yaml preview minHeight="400px"
- brick: eo-time-range-picker
  events:
    - action: console.log
  properties:
    label: hello
    name: time
```

### With Form

```yaml preview minHeight="400px"
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-time-range-picker
      properties:
        label: 时间
        name: time
        required: true
    - brick: eo-submit-buttons
```
