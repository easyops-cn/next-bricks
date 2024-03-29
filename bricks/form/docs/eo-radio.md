表单单选构件。

```yaml preview
- brick: eo-radio
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
- brick: eo-radio
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
- brick: eo-radio
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
    value: Guangzhou
```

### Options

```yaml preview
- brick: eo-radio
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
    value: Guangzhou
- brick: eo-radio
  properties:
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
- brick: eo-radio
  properties:
    options:
      - true
      - false
```

### Disabled

```yaml preview
- brick: eo-flex-layout
  properties:
    gap: 20px
    flexDirection: column
  children:
    - brick: eo-radio
      properties:
        value: 0
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
    - brick: eo-radio
      properties:
        disabled: true
        value: 1
        options:
          - label: Beijing
            value: 0
          - label: Shanghai
            value: 1
          - label: Guangzhou
            value: 2
          - label: Shenzhen
            value: 3
    - brick: eo-radio
      properties:
        label: Icon
        type: default
        disabled: true
        value: 0
        options:
          - label: Python
            value: 0
            icon:
              lib: easyops
              category: colored-common
              icon: python
          - label: Javascript
            value: 1
            icon:
              lib: easyops
              category: program-language
              icon: javascript
          - label: Powershell
            value: 2
            icon:
              lib: easyops
              category: colored-common
              icon: powershell
          - label: Shell
            value: 3
            icon:
              lib: easyops
              category: colored-common
              icon: shell
    - brick: eo-radio
      properties:
        label: Button
        type: button
        value: Shanghai
        disabled: true
        value: Beijing
        options:
          - Beijing
          - Shanghai
          - Guangzhou
          - Shenzhen
    - brick: eo-radio
      properties:
        label: dashboard
        type: button
        ui: dashboard
        value: Shanghai
        options:
          - label: Beijing
            value: Beijing
          - label: Shanghai
            value: Shanghai
            disabled: true
          - label: Guangzhou
            value: Guangzhou
          - label: Shenzhen
            value: Shenzhen
    - brick: eo-radio
      properties:
        label: Icon
        type: icon
        value: 1
        disabled: true
        options:
          - label: Beijing
            value: 0
            icon:
              icon: "area-chart"
              lib: "antd"
          - label: Shanghai
            value: 1
            icon:
              icon: "bar-chart"
              lib: "antd"
          - label: Guangzhou
            value: 2
            icon:
              icon: "area-chart"
              lib: "antd"
    - brick: eo-radio
      properties:
        label: Icon Cricle
        type: icon-circle
        value: 0
        disabled: true
        options:
          - label: Beijing
            value: 0
            icon:
              icon: "area-chart"
              lib: "antd"
          - label: Shanghai
            value: 1
            icon:
              icon: "bar-chart"
              lib: "antd"
          - label: Guangzhou
            value: 2
            icon:
              icon: "area-chart"
              lib: "antd"
    - brick: eo-radio
      properties:
        label: Icon Square
        type: icon-square
        value: 2
        disabled: true
        options:
          - label: Beijing
            value: 0
            icon:
              icon: "area-chart"
              lib: "antd"
          - label: Shanghai
            value: 1
            icon:
              icon: "bar-chart"
              lib: "antd"
          - label: Guangzhou
            value: 2
            icon:
              icon: "area-chart"
              lib: "antd"
```

### Size

Used only when `type` is `button`.

```yaml preview
- brick: eo-radio
  properties:
    label: large
    size: large
    type: button
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-radio
  properties:
    label: medium
    size: medium
    type: button
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-radio
  properties:
    label: small
    size: small
    type: button
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### Type

```yaml preview
- brick: eo-flex-layout
  properties:
    gap: 20px
    flexDirection: column
  children:
    - brick: eo-radio
      properties:
        label: Default
        type: default
        value: Beijing
        options:
          - Beijing
          - Shanghai
          - Guangzhou
          - Shenzhen
    - brick: eo-radio
      properties:
        label: Icon
        type: default
        options:
          - label: Python
            value: 0
            icon:
              lib: easyops
              category: colored-common
              icon: python
          - label: Javascript
            value: 1
            icon:
              lib: easyops
              category: program-language
              icon: javascript
          - label: Powershell
            value: 2
            icon:
              lib: easyops
              category: colored-common
              icon: powershell
          - label: Shell
            value: 3
            icon:
              lib: easyops
              category: colored-common
              icon: shell
    - brick: eo-radio
      properties:
        label: Button
        type: button
        value: Shanghai
        options:
          - Beijing
          - Shanghai
          - Guangzhou
          - Shenzhen
    - brick: eo-radio
      properties:
        label: dashboard
        type: button
        ui: dashboard
        value: Shanghai
        options:
          - label: Beijing
            value: Beijing
          - label: Shanghai
            value: Shanghai
          - label: Guangzhou
            value: Guangzhou
          - label: Shenzhen
            value: Shenzhen
    - brick: eo-radio
      properties:
        label: Icon
        type: icon
        value: 1
        options:
          - label: Beijing
            value: 0
            icon:
              icon: "area-chart"
              lib: "antd"
          - label: Shanghai
            value: 1
            icon:
              icon: "bar-chart"
              lib: "antd"
          - label: Guangzhou
            value: 2
            icon:
              icon: "area-chart"
              lib: "antd"
    - brick: eo-radio
      properties:
        label: Icon Cricle
        type: icon-circle
        value: 0
        options:
          - label: Beijing
            value: 0
            icon:
              icon: "area-chart"
              lib: "antd"
          - label: Shanghai
            value: 1
            icon:
              icon: "bar-chart"
              lib: "antd"
          - label: Guangzhou
            value: 2
            icon:
              icon: "area-chart"
              lib: "antd"
    - brick: eo-radio
      properties:
        label: Icon Square
        type: icon-square
        value: 2
        options:
          - label: Beijing
            value: 0
            icon:
              icon: "area-chart"
              lib: "antd"
          - label: Shanghai
            value: 1
            icon:
              icon: "bar-chart"
              lib: "antd"
          - label: Guangzhou
            value: 2
            icon:
              icon: "area-chart"
              lib: "antd"
```

### Event

```yaml preview
- brick: eo-radio
  properties:
    id: option-radio
    options:
      - label: Beijing
        value: 0
      - label: Shanghai
        value: 1
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
- brick: eo-button
  properties:
    textContent: Click to Change Radio Option
  events:
    click:
      - target: "#option-radio"
        properties:
          options:
            - label: Beijing
              value: 0
            - label: Shanghai
              value: 1
            - label: Guangzhou
              value: 2
            - label: Shenzhen
              value: 3
            - label: Hangzhou
              value: 4
```
