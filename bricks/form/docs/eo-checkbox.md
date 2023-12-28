表单复选框构件。

```yaml preview
- brick: eo-checkbox
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
- brick: eo-checkbox
  properties:
    label: city
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
      - Tianjin
      - Hanzhou
      - Xi'an
      - Fuzhou
      - Nanchan
      - Changsha
      - Shenyang
      - Jinan
      - Guiyang
      - Wuhan
```

### Value

```yaml preview
- brick: eo-checkbox
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
- brick: eo-checkbox
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
    value:
      - Guangzhou
- brick: eo-checkbox
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
- brick: eo-checkbox
  properties:
    options:
      - true
      - false
    value:
      - true
```

### Disabled

```yaml preview
- brick: eo-checkbox
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
    value:
      - 0
      - 2
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-checkbox
  properties:
    disabled: true
    value:
      - 1
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
- brick: eo-checkbox
  properties:
    label: Default
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
- brick: div
  properties:
    style:
      height: 20px
- brick: eo-checkbox
  properties:
    label: Icon
    type: icon
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
```

### checkboxColor

```yaml preview
- brick: eo-checkbox
  properties:
    options:
      - label: Beijing
        value: 0
        checkboxColor: red
      - label: Shanghai
        value: 1
        checkboxColor: orange
        icon:
          icon: "bar-chart"
          lib: "antd"
      - label: Guangzhou
        value: 2
        checkboxColor: blue
      - label: Shenzhen
        value: 3
        checkboxColor: green
    value:
      - 2
      - 1
```

### optionGroups

```yaml preview
- brick: eo-checkbox
  events:
    change:
      action: console.log
  properties:
    isGroup: true
    label: 商品
    name: goods
    optionGroups:
      - key: fruits
        name: 水果
        options:
          - label: 苹果
            value: apple
          - label: 香蕉
            value: banana
      - key: vegetables
        name: 蔬菜
        options:
          - label: 土豆
            value: potato
    value:
      - banana
      - potato
```

### Event

```yaml preview
- brick: eo-checkbox
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
- brick: eo-button
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

### With Form

```yaml preview
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-checkbox
      properties:
        name: city
        label: 城市
        required: true
        options:
          - Beijing
          - Shanghai
          - Guangzhou
          - Shenzhen
    - brick: eo-submit-buttons
```
