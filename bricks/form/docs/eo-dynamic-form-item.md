动态表单构件。

```yaml preview
- brick: eo-form
  properties:
    layout: vertical
    values:
      id: request_5XXX
      dimension:
        - dimensionName: one
          dimensionId: one
          dimensionValue: 1
  children:
    - brick: eo-input
      properties:
        name: id
        label: 指标ID
        required: true
    - brick: eo-dynamic-form-item
      properties:
        name: dimension
        label: 维度
        useBrick:
          - brick: eo-input
            properties:
              name: dimensionName
              required: true
              message:
                required: 维度名称为必填项
              label: 维度名称
          - brick: eo-input
            properties:
              name: dimensionId
              required: true
              message:
                required: 维度id为必填项
              label: 维度id
              unique: true
              validator: '<% (value) => (value.length > 5 ? "维度id不能超过5" : "") %>'
          - brick: eo-input
            properties:
              name: dimensionValue
              label: 维度值
    - brick: eo-submit-buttons
      properties:
        cancelText: 取消
        submitText: 提交
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

### hideRemoveButton、disabledRemoveButton;hideAddButton、disabledAddButton

```yaml preview
- brick: eo-dynamic-form-item
  properties:
    hideAddButton: <% (value)=>value.length===5 %>
    disabledAddButton: <% (value)=>value.length===4 %>
    hideRemoveButton: <% (value,row)=>row===1 %>
    disabledRemoveButton: <% (value,row)=>row===0 %>
    value:
      - input: hello1
        select: abc1
      - input: hello2
        select: abc2
      - input: hello3
        select: abc3
    useBrick:
      - brick: eo-input
        properties:
          name: input
      - brick: eo-select
        properties:
          name: select
          options:
            - abc1
            - abc2
            - abc2
            - abc4
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
    row.remove:
      action: console.log
    row.add:
      action: console.log
    change:
      - action: message.success
        args:
          - <% JSON.stringify(EVENT.detail) %>
```
