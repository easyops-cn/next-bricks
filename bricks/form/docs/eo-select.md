表单下拉选择构件。

```yaml preview
- brick: eo-select
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

## Examples

### Label

```yaml preview
- brick: eo-select
  properties:
    label: city
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Value

```yaml preview
- brick: eo-select
  properties:
    label: city
    value: Shanghai
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Options

```yaml preview
- brick: eo-select
  properties:
    label: string
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
    value: Guangzhou
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-select
  properties:
    label: Array<object>
    options:
      - label: Beijing
        value: 0
      - label: Shanghai
        value: 1
      - label: Guangzhou
        value: 2
      - label: Shenzhen
        value: 3
    value: 2
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-select
  properties:
    label: boolean
    options:
      - true
      - false
```

### Disabled

```yaml preview
- brick: eo-select
  properties:
    options:
      - label: Beijing
        value: 0
        disabled: true
      - label: Shanghai
        value: 1
      - label: Guangzhou
        value: 2
      - label: Shenzhen
        value: 3
- brick: eo-select
  properties:
    disabled: true
    options:
      - label: Beijing
        value: 0
      - label: Shanghai
        value: 1
      - label: Guangzhou
        value: 2
      - label: Shenzhen
        value: 3
```

### Multiple

```yaml preview
- brick: eo-select
  properties:
    label: multiple
    multiple: true
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Placeholder

```yaml preview
- brick: eo-select
  properties:
    placeholder: This is placeholder...
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Input Style

```yaml preview
- brick: eo-select
  properties:
    inputStyle:
      width: 180px
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Event

```yaml preview
- brick: eo-select
  properties:
    id: options-change-select
    label: Single
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
  events:
    change:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
    options.change:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: eo-select
  properties:
    label: Multiple
    multiple: true
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
  events:
    change:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: eo-button
  properties:
    textContent: Click to change options
  events:
    click:
      - target: "#options-change-select"
        properties:
          options:
            - Beijing
            - Shanghai
            - Guangzhou
            - Shenzhen
            - Hangzhou
- brick: div
  properties:
    style:
      height: 20px
```
