表单下拉选择构件。

```yaml preview minHeight="250px"
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

```yaml preview minHeight="250px"
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

```yaml preview minHeight="250px"
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

```yaml preview minHeight="300px"
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

```yaml preview minHeight="250px"
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

```yaml preview minHeight="250px"
- brick: eo-select
  properties:
    label: multiple
    mode: multiple
    value:
      - Beijing
      - Guangzhou
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Tags & TokenSeparators & MaxTagCount

```yaml preview minHeight="250px"
- brick: eo-select
  properties:
    label: tags
    mode: tags
    tokenSeparators:
      - " "
      - ";"
      - "；"
    maxTagCount: 3
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Placeholder

```yaml preview minHeight="250px"
- brick: eo-select
  properties:
    placeholder: This is placeholder...
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Suffix

```yaml preview minHeight="250px"
- brick: eo-select
  properties:
    placeholder: This is placeholder...
    options:
      - label: Beijing
        value: 1
        color: red
        tag: 京
      - label: Shanghai
        value: 2
        color: green
        tag: 沪
      - label: Guangzhou
        value: 3
        color: blue
        tag: 粤
      - label: Shenzhen
        value: 4
        color: yellow
        tag: 粤
    suffix:
      brick: eo-tag
      properties:
        textContent: <% DATA.tag %>
        color: <% DATA.color %>
```

### GroupBy

```yaml preview minHeight="300px"
- brick: eo-select
  properties:
    placeholder: This is placeholder...
    groupBy: tag
    options:
      - label: Beijing
        value: 1
        color: red
        tag: 京
      - label: Shanghai
        value: 2
        color: green
        tag: 沪
      - label: Guangzhou
        value: 3
        color: blue
        tag: 粤
      - label: Shenzhen
        value: 4
        color: yellow
        tag: 粤
```

### Fields

```yaml preview minHeight="300px"
- brick: eo-select
  properties:
    placeholder: This is placeholder...
    fields:
      label: name
      value: city
    value: 3
    options:
      - name: Beijing
        city: 1
        color: red
        tag: 京
      - name: Shanghai
        city: 2
        color: green
        tag: 沪
      - name: Guangzhou
        city: 3
        color: blue
        tag: 粤
      - name: Shenzhen
        city: 4
        color: yellow
        tag: 粤
```

### UseBackend

```yaml preview minHeight="300px"
- brick: eo-select
  properties:
    label: useBackend
    placeholder: 后端搜索
    value: Shenzhen
    useBackend:
      provider: basic.http-request
      transform: |
        <% (data) => data %>
      onValueChangeArgs:
        - |
          <% 
            (q) => 
              `//api.weatherapi.com/v1/search.json?q=${q}&key=${MISC.weather_api_key}`
          %>
      args:
        - |
          <% 
            (q) => 
              `//api.weatherapi.com/v1/search.json?q=${q ? q : "China"}&key=${MISC.weather_api_key}`
          %>
    fields:
      label: name
      value: name
    suffix:
      brick: eo-tag
      properties:
        textContent: <% DATA.country %>
```

### Input Style

```yaml preview minHeight="250px"
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

```yaml preview minHeight="400px"
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

### With Form

```yaml preview minHeight="250px"
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-select
      properties:
        options:
          - Beijing
          - Shanghai
          - Guangzhou
          - Shenzhen
        label: 选择框
        name: select
        required: true
    - brick: eo-submit-buttons
```
