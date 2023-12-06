构件 `eo-auto-complete`

## Examples

### Basic

```yaml preview minHeight=500px
- brick: eo-auto-complete
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### caption

```yaml preview
- brick: eo-auto-complete
  properties:
    options:
      - label: 选项1
        value: "1"
        caption: 说明1
      - label: 选项2
        value: "2"
        caption: 说明2
      - label: 选项3
        value: "3"
        caption: 说明3
```

### 分组

```yaml preview
- brick: eo-auto-complete
  properties:
    options:
      - label: 选项1
        value: "1"
        caption: 说明1
      - label: 选项2
        value: "2"
        caption: 说明2
      - label: 分组1
        options:
          - label: 选项3-1
            value: 3-1
            caption: 说明3-1
          - label: 选项3-1
            value: 3-2
            caption: 说明3-2
```

### filterByCaption

```yaml preview
- brick: eo-auto-complete
  properties:
    filterByCaption: true
    options:
      - label: 选项1
        value: "1"
        caption: 说明1
      - label: 选项2
        value: "2"
        caption: 说明2
      - label: 分组1
        options:
          - label: 选项3-1
            value: 3-1
            caption: 说明3-1
          - label: 选项3-1
            value: 3-2
            caption: 说明3-2
```

### disabled

```yaml preview
- brick: eo-auto-complete
  properties:
    disabled: true
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### events

```yaml preview
- brick: eo-auto-complete
  events:
    change:
      - action: console.log
  properties:
    options:
      - Beijing
      - Shanghai
      - Guangzhou
      - Shenzhen
```

### With Form

```yaml preview minHeight=500px
- brick: eo-form
  events:
    validate.success:
      - action: console.log
    values.change:
      - action: console.log
  children:
    - brick: eo-auto-complete
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
