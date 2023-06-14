表单复选框构件。

```yaml preview
- brick: form.general-checkbox
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
- brick: form.general-checkbox
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
- brick: form.general-checkbox
  properties:
    value:
      - Beijing
      - Guangzhou
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Options

```yaml preview
- brick: form.general-checkbox
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
    value:
      - Guangzhou
- brick: form.general-checkbox
  properties:
    options:
      - label: Beijing
        value: 0
      - label: Shanghai
        value: 1
        icon:
          icon: "bar-chart"
          lib: "antd"
      - label: Guangzhou
        value: 2
      - label: Shenzhen
        value: 3
    value:
      - 2
      - 3
- brick: form.general-checkbox
  properties:
    options:
      - true
      - false
    value:
      - true
```

### Disabled

```yaml preview
- brick: form.general-checkbox
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
- brick: div
  properties:
    style:
      height: 20px
- brick: form.general-checkbox
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

### Type

```yaml preview
- brick: form.general-checkbox
  properties:
    label: Default
    type: default
    options:
      - label: Beijing
        value: 0
        icon:
          icon: "search"
          lib: "antd"
      - label: Shanghai
        value: 1
        icon:
          icon: "plus"
          lib: "antd"
      - label: Guangzhou
        value: 2
        icon:
          icon: "edit"
          lib: "antd"
      - label: Shenzhen
        value: 3
        icon:
          icon: "delete"
          lib: "antd"
- brick: div
  properties:
    style:
      height: 20px
- brick: form.general-checkbox
  properties:
    label: Icon
    type: icon
    options:
      - label: Beijing
        value: 0
        icon:
          icon: "search"
          lib: "antd"
      - label: Shanghai
        value: 1
        icon:
          icon: "plus"
          lib: "antd"
      - label: Guangzhou
        value: 2
        icon:
          icon: "edit"
          lib: "antd"
      - label: Shenzhen
        value: 3
        icon:
          icon: "delete"
          lib: "antd"
```

### Event

```yaml preview
- brick: form.general-checkbox
  properties:
    id: option-checkbox
    options:
      - label: Beijing
        value: 0
      - label: Shanghai
        value: 1
        icon:
          icon: "bar-chart"
          lib: "antd"
      - label: Guangzhou
        value: 2
      - label: Shenzhen
        value: 3
  events:
    change:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
    options.change:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
- brick: basic.general-button
  properties:
    textContent: Click to Change Radio Option
  events:
    click:
      - target: "#option-checkbox"
        properties:
          options:
            - label: Beijing
              value: 0
            - label: Shanghai
              value: 1
              icon:
                icon: "bar-chart"
                lib: "antd"
            - label: Guangzhou
              value: 2
            - label: Shenzhen
              value: 3
            - label: Hangzhou
              value: 4
```
