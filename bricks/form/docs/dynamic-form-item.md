动态表单构件。

```yaml preview
- brick: form.dynamic-form-item
  properties:
    useBrick:
      - brick: form.general-input
        properties:
          name: input
      - brick: form.general-select
        properties:
          name: select
          options:
            - Beijing
            - Shanghai
            - Guangzhou
            - Shenzhen
```

## Examples

### Label

```yaml preview
- brick: form.dynamic-form-item
  properties:
    label: Label
    useBrick:
      - brick: form.general-input
        properties:
          name: input
      - brick: form.general-select
        properties:
          name: select
          options:
            - Beijing
            - Shanghai
            - Guangzhou
            - Shenzhen
```

### Value

```yaml preview
- brick: form.dynamic-form-item
  properties:
    value:
      - input: 北京
        select: Beijing
      - input: 上海
        select: Shanghai
    useBrick:
      - brick: form.general-input
        properties:
          name: input
      - brick: form.general-select
        properties:
          name: select
          options:
            - Beijing
            - Shanghai
            - Guangzhou
            - Shenzhen
```

### Event

```yaml preview
- brick: form.dynamic-form-item
  properties:
    name: dynamicForm
    useBrick:
      - brick: form.general-input
        properties:
          name: input
      - brick: form.general-select
        properties:
          name: select
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
```
