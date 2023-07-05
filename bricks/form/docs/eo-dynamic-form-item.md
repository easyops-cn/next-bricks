动态表单构件。

```yaml preview
- brick: eo-dynamic-form-item
  properties:
    useBrick:
      - brick: eo-input
        properties:
          name: input
      - brick: eo-select
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
- brick: eo-dynamic-form-item
  properties:
    label: Label
    useBrick:
      - brick: eo-input
        properties:
          name: input
      - brick: eo-select
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
- brick: eo-dynamic-form-item
  properties:
    value:
      - input: 北京
        select: Beijing
      - input: 上海
        select: Shanghai
    useBrick:
      - brick: eo-input
        properties:
          name: input
      - brick: eo-select
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
- brick: eo-dynamic-form-item
  properties:
    name: dynamicForm
    useBrick:
      - brick: eo-input
        properties:
          name: input
      - brick: eo-select
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
