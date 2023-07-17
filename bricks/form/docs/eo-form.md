表单构件。

## Examples

### Layout

```yaml preview
- brick: eo-form
  properties:
    layout: inline
  slots:
    "":
      bricks:
        - brick: eo-input
          properties:
            label: input
        - brick: eo-select
          properties:
            label: select
- brick: div
  properties:
    style:
      height: 1px
      background: "#abc"
      margin: "20px 0"
- brick: eo-form
  properties:
    layout: horizontal
  slots:
    "":
      bricks:
        - brick: eo-input
          properties:
            label: input
        - brick: eo-select
          properties:
            label: select
- brick: div
  properties:
    style:
      height: 1px
      background: "#abc"
      margin: "20px 0"
- brick: div
  properties:
    style:
      height: 1px
      background: "#ddd"
- brick: eo-form
  properties:
    layout: vertical
  slots:
    "":
      bricks:
        - brick: eo-input
          properties:
            label: input
        - brick: eo-select
          properties:
            label: select
```

### Values

```yaml preview
- brick: eo-form
  properties:
    values:
      input: This is default value
      select: Beijing
      radio: Guangzhou
      checkbox:
        - C
        - D
      textarea: "Hello World! \nNice to see you!"
      dynamicForm:
        - input: beijing
          select: Guangzhou
        - input: shenzhen
          select: Shenzhen
  slots:
    "":
      bricks:
        - brick: eo-input
          properties:
            label: input
            name: input
        - brick: eo-select
          properties:
            label: select
            name: select
            options:
              - Beijing
              - Shanghai
        - brick: eo-radio
          properties:
            label: radio
            name: radio
            options:
              - Guangzhou
              - Shenzhen
        - brick: eo-checkbox
          properties:
            name: checkbox
            label: checkbox
            options:
              - A
              - B
              - C
              - D
        - brick: eo-textarea
          properties:
            name: textarea
            label: textarea
            autoSize:
              minRows: 3
        - brick: eo-dynamic-form-item
          properties:
            label: dynamic-form
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
```

### Events

```yaml preview
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
        - brick: eo-input
          properties:
            required: true
            name: name
            label: 姓名
            max: 6
            min: 2
            message:
              required: 一定要填写姓名哟
              max: 不能超过 6 个字符哟
              min: 最少填写 2 个字符哟
        - brick: eo-select
          properties:
            required: true
            name: sex
            label: 性别
            options:
              - label: 男
                value: 0
              - label: 女
                value: 1
        - brick: eo-submit-buttons
```

### Method

```yaml preview
- brick: eo-form
  properties:
    id: form
  slots:
    "":
      bricks:
        - brick: eo-input
          properties:
            required: true
            name: name
            label: 姓名
            max: 6
            min: 2
        - brick: eo-select
          properties:
            required: true
            name: sex
            label: 性别
            options:
              - label: 男
                value: 0
              - label: 女
                value: 1
- brick: eo-button
  properties:
    textContent: validateFields
  events:
    click:
      - target: "#form"
        method: validate
- brick: eo-button
  properties:
    textContent: setInitValue
  events:
    click:
      - target: "#form"
        method: setInitValue
        args:
          - name: Mike
            sex: 0
- brick: eo-button
  properties:
    textContent: resetFields
  events:
    click:
      - target: "#form"
        method: resetFields
- brick: eo-button
  properties:
    textContent: resetFields(name)
  events:
    click:
      - target: "#form"
        method: resetFields
        args:
          - name
- brick: eo-button
  properties:
    textContent: getFieldsValue
  events:
    click:
      - target: "#form"
        method: getFieldsValue
        callback:
          success:
            - action: console.log
- brick: eo-button
  properties:
    textContent: getFieldsValue(name)
  events:
    click:
      - target: "#form"
        method: getFieldsValue
        args:
          - name
        callback:
          success:
            - action: console.log
- brick: eo-button
  properties:
    textContent: validateField(name)
  events:
    click:
      - target: "#form"
        method: validateField
        args:
          - name
- brick: eo-button
  properties:
    textContent: resetValidateState
  events:
    click:
      - target: "#form"
        method: resetValidateState
```
